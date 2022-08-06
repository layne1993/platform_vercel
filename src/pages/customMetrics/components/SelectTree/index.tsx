import React, { useEffect, useState } from 'react';
import { Tree, Input, Spin } from 'antd';
import { renderTree, getParentKey } from './SelectTreeUtils';
import { connect } from 'dva';
import { SelectTreePro } from './selectPro';
import { cloneDeep } from 'lodash';

const { TreeNode } = Tree;
const { Search } = Input;

const SlectTree: React.FC<SelectTreePro> = (props) => {
    const [searchValue, changeSearchValue] = useState<string>('');
    const [autoExpandParent, changeAutoExpandParent] = useState<boolean>(true);
    const [expandedKeys, onExpand] = useState<string[]>([]);
    const [gData, setGData] = useState<any[]>([]);
    const [renderArr, setRenderArr] = useState<any[]>([]);
    const onExpandFn = (expandedKeys: string[]) => {
        onExpand(expandedKeys);
        changeAutoExpandParent(false);
    };
    const onCheck = (checkedKeys) => {
        const checkedOrgArr = [];
        for (let i = 0; i < checkedKeys.length; i++) {
            renderArr.forEach((item) => {
                if (item.targetCode === checkedKeys[i]) {
                    checkedOrgArr.push(item);
                }
            });
        }
        console.log(checkedKeys, 'checkedKeys', checkedOrgArr);
        // 查询对应的
        const { dispatch } = props;
        dispatch({
            type: 'customMetricsSelectTree/savecheckedKeysAndCheckedOrgArr',
            checkedKeys,
            checkedOrgArr
        });
    };
    const changeSearchValueFn = (val: string) => {
        const expandedKeys = renderArr
            .map((item) => {
                if (item.targetName.indexOf(val) > -1) {
                    return getParentKey(item.targetCode, gData);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        changeSearchValue(val);
        onExpand(expandedKeys);
        changeAutoExpandParent(true);
    };
    const loop = (data) =>
        data.map((item) => {
            const index = item.targetName.indexOf(searchValue);
            const beforeStr = item.targetName.substr(0, index);
            const afterStr = item.targetName.substr(index + searchValue.length);
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span style={{ color: '#f50' }}>{searchValue}</span>
                        {afterStr}
                    </span>
                ) : (
                    <span>{item.targetName}</span>
                );
            if (item.children.length) {
                return (
                    <TreeNode key={item.targetCode} title={title}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={item.targetCode}
                    title={title}
                    disabled={Boolean(item.required)}
                    style={{
                        minWidth: 300
                    }}
                />
            );
        });

    useEffect(() => {
        // 请求树结构
        const { dispatch } = props;
        dispatch({
            type: 'customMetricsSelectTree/queryTreeList',
            callback(res) {
                const list = res.data || [];
                console.log(renderTree(list));
                setGData(renderTree(list));
                const checkedOrgArr = [];
                const checkedKeys = list
                    .filter((item) => item.enable)
                    .map((item) => item.targetCode);
                for (let i = 0; i < checkedKeys.length; i++) {
                    list.forEach((item) => {
                        if (item.targetCode === checkedKeys[i]) {
                            checkedOrgArr.push(item);
                        }
                    });
                }
                setRenderArr(list);
                onExpand(list.map((item) => item.targetCode));
                dispatch({
                    type: 'customMetricsSelectTree/saveRenderArr',
                    renderArr: list
                });
                dispatch({
                    type: 'customMetricsSelectTree/savecheckedKeysAndCheckedOrgArr',
                    checkedKeys,
                    checkedOrgArr
                });
                // 保存初始选中，作用于清空数据
                dispatch({
                    type: 'customMetricsSelectTree/saveInitCheckKeysAndCheckedOrgArr',
                    initCheckedKeys: cloneDeep(checkedKeys),
                    initCheckedOrgArr: cloneDeep(checkedOrgArr)
                });
            }
        });
    }, []);
    return (
        <Spin spinning={Boolean(props.loading)}>
            <Search
                style={{ marginBottom: 8 }}
                placeholder="请输入"
                onChange={(e) => {
                    changeSearchValueFn(e.target.value);
                }}
            />
            <span
                style={{
                    fontSize: 12,
                    color: '#333'
                }}
            >
                注：修改指标后，点击页面右侧”生成数据“才会生效
            </span>
            <div
                style={{
                    maxHeight: 552,
                    overflow: 'auto'
                }}
            >
                <Tree
                    checkedKeys={props.customMetricsSelectTree.checkedKeys}
                    checkable
                    onCheck={(e: React.Key[]) => onCheck(e)}
                    onExpand={(e: string[]) => onExpandFn(e)}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    selectable={false}
                >
                    {loop(gData)}
                </Tree>
            </div>
        </Spin>
    );
};

export default connect(({ customMetricsSelectTree, loading }) => ({
    customMetricsSelectTree,
    loading: loading.effects['customMetricsSelectTree/queryTreeList']
}))(SlectTree);
