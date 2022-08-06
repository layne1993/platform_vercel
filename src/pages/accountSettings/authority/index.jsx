import {
    Row,
    Col,
    Card,
    Input,
    Button,
    List,
    Tree,
    Checkbox,
    notification,
    Spin,
    Modal
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import deleteImg from '../../../assets/delete.png';
import styles from './style.less';
import { getRandomKey, authTransform } from '@/utils/utils';
import { cloneDeep, isEmpty } from 'lodash';

const { confirm } = Modal;
const { Search } = Input;

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

class Authority extends Component {
    state = {
        roleList: [], // 角色列表
        roleName: '', // 角色名称
        checkedList: [], // 角色菜单权限树结构选中列表
        currentRoleId: 0, // 当前角色id
        menuAuths: [], // 原始的菜单列表
        treeRoleList: [], // 整理后的菜单权限数据
        isDefault: false //是不是默认内置权限
    };

    componentDidMount() {
        this.getPowerList();
    }

    baseFormRef = React.createRef();

    /**
     * 获取权限
     */
    getQuireMenuByRoleId = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/quireMenuByRoleId'
        });
    };

    /**
     * @description: 获取角色列表
     * @param {*}
     */
    getPowerList = () => {
        const { dispatch } = this.props;

        dispatch({
            type: 'authority/quireRoleList',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        roleList: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };

    /**
     * @description: 树结构数据整理
     * @param {*} arr
     */
    sortArr = (arr, isDefault) => {
        // console.log(isDefault)
        // console.log(arr)
        const copy = cloneDeep(arr);
        const obj = {};

        copy.forEach((item) => {
            item.key = item.menuCode;
            item.title = (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span onClick={this.preventCapture}>{item.menuName}</span>
                    <div
                        className={styles.treeStyle}
                        style={
                            !isEmpty(item.operations) && item.operations.length < 2
                                ? { marginRight: 124 }
                                : null
                        }
                    >
                        {item &&
                            !isEmpty(item.operations) &&
                            item.operations.map((roleItem) => {
                                return (
                                    <Checkbox
                                        defaultChecked={roleItem.enableStatus === 1}
                                        onClick={(e) => e.stopPropagation()}
                                        disabled={isDefault === 1 || this.state.isDefault}
                                        // checked={roleItem.enableStatus === 1}
                                        onChange={(e) => this.handleChecked(e, roleItem, item)}
                                        key={getRandomKey(5)}
                                    >
                                        {roleItem.operationName}
                                    </Checkbox>
                                );
                            })}
                    </div>
                </div>
            );

            obj[item.menuCode] = item;
        });

        const res = [];

        copy.forEach((item) => {
            if (item.parentCode === 0) {
                res.push(item);
            }

            for (const key in obj) {
                if (item.menuCode === obj[key].parentCode) {
                    if (item.children) {
                        item.children.push(obj[key]);
                    } else {
                        item.children = [obj[key]];
                    }
                }
            }
        });
        return res;
    };

    /**
     * @description: 只读、编辑、数据导出权限checkbox change事件
     * @param {*} e
     * @param {*} roleItem
     * @param {*} parentItem
     */
    handleChecked = (e, roleItem, parentItem) => {
        const { menuAuths } = this.state;

        let status = e.target.checked === true ? 1 : 0;
        let tempMenuAuths = cloneDeep(menuAuths);

        Array.isArray(tempMenuAuths) &&
            tempMenuAuths.forEach((menuItem) => {
                if (menuItem.menuCode === parentItem.menuCode) {
                    !isEmpty(menuItem.operations) &&
                        menuItem.operations.forEach((item) => {
                            if (item.operationCode === roleItem.operationCode) {
                                item.enableStatus = status;
                            }
                        });
                }
            });

        this.setState({
            menuAuths: tempMenuAuths
        });
    };

    // 根据id查询角色权限详情
    newAuth = (id) => {
        const { dispatch } = this.props;

        dispatch({
            type: 'authority/quireMenuByRoleId',

            payload: {
                roleId: id
            },

            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        treeRoleList: this.sortArr(res.data.menuAuths, res.data.isDefault),
                        // isDefault: res.data.isDefault === 1,
                        menuAuths: res.data.menuAuths,
                        roleName: res.data.roleName,
                        checkedList: this.getMenuChecked(res.data.menuAuths)
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };

    // 查看、删除当前角色 type: 1：新增 2: 查看 3： 删除
    viewPermissions = (e, id, type, Default) => {
        e.stopPropagation();
        if(Default){
            this.setState({
                isDefault:Default
            });
        }else{
            this.setState({
                isDefault:false
            });
        }
        const { dispatch } = this.props;
        if (type !== 3) {
            // 点击角色菜单时清除之前保存的数据
            this.setState({
                currentRoleId: id,
                checkedList: [],
                roleName: ''
            });
        }
        if (type === 1) {
            this.queryMenuOperation();
        } else if (type === 2) {
            this.newAuth(id);
        } else {
            const _this = this;
            confirm({
                title: '请您确认是否删除该角色?',
                icon: <ExclamationCircleOutlined />,
                // content: '删除后该净值信息会全部删除',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    dispatch({
                        type: 'authority/deleteRole',
                        payload: {
                            roleId: id
                        },
                        callback: (res) => {
                            if (res.code === 1008) {
                                openNotification('success', '提示', '删除成功', 'topRight');
                                _this.getPowerList();
                                _this.setState({
                                    treeRoleList: []
                                });
                            } else {
                                const warningText = res.message || res.data || '删除失败！';
                                openNotification(
                                    'warning',
                                    `提示（代码：${res.code}）`,
                                    warningText,
                                    'topRight',
                                );
                            }
                        }
                    });
                },
                onCancel() {
                    // console.log('Cancel');
                }
            });
        }
    };

    // 新增时查询所有菜单权限
    queryMenuOperation = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'authority/queryAllMenuRole',
            payload: {},
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        treeRoleList: this.sortArr(res.data),
                        menuAuths: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };

    /**
     * @description: 点击取消按钮
     * @param {*}
     */
    cancelEditing = () => {
        this.setState({
            roleName: '',
            checkedList: [],
            currentRoleId: 0,
            menuAuths: [],
            treeRoleList: []
        });
    };

    /**
     * @description: 角色查询搜索
     * @param {*} e
     */
    onSearch = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'authority/quireRoleList',
            payload: {
                roleName: value
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        roleList: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };

    /**
     * @description: 新增时输入角色名称
     * @param {*} value
     */
    setAtitle = (value) => {
        this.setState({
            roleName: value
        });
    };

    /**
     * @description: 菜单权限树结构check change事件
     * @param {*} checkedKeys
     * @param {*} info
     */
    onCheck = (checkedKeys, info) => {
        // console.log('info', info);
        const { menuAuths } = this.state;
        const { node } = info;
        let tempMenuArr = cloneDeep(menuAuths);

        Array.isArray(tempMenuArr) &&
            tempMenuArr.forEach((item) => {
                if (item.menuCode === node.menuCode) {
                    if (info.checked) {
                        item.enableStatus = 1;
                    } else {
                        item.enableStatus = 0;
                    }
                }
            });

        this.setState({
            checkedList: checkedKeys,
            menuAuths: tempMenuArr
        });
    };

    /**
     * @description: 保存
     * @param {*}
     */
    onOk = () => {
        const { currentRoleId, roleName, menuAuths } = this.state;

        const { dispatch } = this.props;

        let menuLists = this.changeOperations(menuAuths);

        let queryName = currentRoleId === 0 ? 'addRoleMenu' : 'editRoleMenu';
        let tips = currentRoleId === 0 ? '新增' : '编辑';
        if (!!roleName) {
            dispatch({
                type: `authority/${queryName}`,
                payload: {
                    roleId: currentRoleId,
                    roleName,
                    menuAuths: menuLists
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        openNotification('success', '提示', `${tips}成功`, 'topRight');
                        this.newAuth(res.data);
                        this.getPowerList();
                        this.getQuireMenuByRoleId();
                    } else {
                        const warningText = res.message || res.data || `${tips}失败`;
                        openNotification(
                            'warning',
                            `提示(代码：${res.code})`,
                            warningText,
                            'topRight',
                        );
                    }
                }
            });
        } else {
            openNotification('warning', '提示', '角色名称不能为空', 'topRight');
        }
    };

    /**
     * @description: 获取checkbox选中的菜单权限
     * @param {*} arr
     */
    getMenuChecked = (arr) => {
        let tempArr = [];
        Array.isArray(arr) &&
            arr.forEach((item) => {
                if (item.enableStatus === 1) {
                    tempArr.push(item.menuCode);
                }
            });
        return tempArr;
    };

    /**
     * @description: 入参数据处理
     * @param {*} arr
     */
    changeOperations = (arr) => {
        Array.isArray(arr) &&
            arr.forEach((item) => {
                let tempArr = [];
                !isEmpty(item.operations) &&
                    item.operations.forEach((sonTtem) => {
                        if (sonTtem.enableStatus === 1) {
                            tempArr.push(sonTtem.operationCode);
                        }
                    });
                item.operationCodes = tempArr;
            });
        return arr;
    };

    render() {
        const { roleList, treeRoleList, checkedList, roleName, isDefault } = this.state;
        console.log(isDefault);
        const {
            submitting,
            detailLoading,
            queryAllLoading,
            editLoading,
            queryAllListLoading
        } = this.props;
        // eslint-disable-next-line no-undef
        const { authEdit } =
            (sessionStorage.getItem('PERMISSION') &&
                JSON.parse(sessionStorage.getItem('PERMISSION'))['122000']) ||
            {};

        return (
            <PageHeaderWrapper>
                <Spin spinning={queryAllListLoading}>
                    <Row gutter={[8]}>
                        <Col span={7}>
                            <Card bordered={false} className={styles.card}>
                                <Row>
                                    <Col span={20}>
                                        <Search
                                            placeholder="搜索"
                                            prefix={<SearchOutlined />}
                                            onSearch={this.onSearch}
                                        />
                                    </Col>
                                    {authEdit && (
                                        <Col span={4}>
                                            <Button
                                                type="primary"
                                                onClick={(e) => this.viewPermissions(e, 0, 1)}
                                            >
                                                新增
                                            </Button>
                                        </Col>
                                    )}
                                </Row>

                                <List
                                    style={{ marginTop: 20 }}
                                    itemLayout="horizontal"
                                    dataSource={roleList}
                                    renderItem={(item) => (
                                        <List.Item className={styles.listHover}>
                                            <a
                                                onClick={(e) =>
                                                    this.viewPermissions(e, item.roleId, 2, item.isDefault)
                                                }
                                            >
                                                <span>{item.roleName}</span>
                                                {(authEdit && item.isDefault !== 1 && (
                                                    <img
                                                        onClick={(e) =>
                                                            this.viewPermissions(e, item.roleId, 3)
                                                        }
                                                        className={styles.deleteImg}
                                                        alt=""
                                                        src={deleteImg}
                                                    />
                                                )) || <span className={styles.deleteImg}></span>}
                                            </a>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>

                        <Col span={17}>
                            <Card bordered={false} className={styles.card}>
                                {!isEmpty(treeRoleList) ? (
                                    <Spin
                                        spinning={
                                            (!!detailLoading && detailLoading) ||
                                            (!!queryAllLoading && queryAllLoading)
                                        }
                                    >
                                        <Fragment>
                                            <Input
                                                placeholder="请输入权限名称"
                                                style={{ maxWidth: '30%' }}
                                                disabled={isDefault}
                                                onChange={(e) => this.setAtitle(e.target.value)}
                                                value={roleName || undefined}
                                            />

                                            <Card style={{ marginTop: 20 }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between'
                                                    }}
                                                >
                                                    <h3>角色菜单权限选择</h3>

                                                    <h4 style={{ color: 'red' }}>
                                                        如不勾选右侧权限则默认为只读
                                                    </h4>
                                                </div>

                                                <Tree
                                                    checkable
                                                    checkStrictly
                                                    disabled={isDefault}
                                                    checkedKeys={checkedList}
                                                    defaultExpandAll
                                                    onCheck={this.onCheck}
                                                    treeData={treeRoleList}
                                                    showLine
                                                    blockNode
                                                />
                                            </Card>

                                            <div className={styles.buttonGroup}>
                                                {authEdit && (
                                                    <Button
                                                        // disabled={!powerInfo.isEdit}
                                                        disabled={isDefault}
                                                        type="primary"
                                                        loading={submitting || editLoading}
                                                        onClick={this.onOk}
                                                    >
                                                        保存
                                                    </Button>
                                                )}

                                                <Button onClick={this.cancelEditing}>取消</Button>
                                            </div>
                                        </Fragment>
                                    </Spin>
                                ) : (
                                    <h3 className={styles.defaultTip}>请选择权限编辑</h3>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Spin>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ accountList, loading }) => ({
    submitting: loading.effects['authority/addRoleMenu'],
    editLoading: loading.effects['authority/editRoleMenu'],
    detailLoading: loading.effects['authority/quireMenuByRoleId'],
    queryAllLoading: loading.effects['authority/queryAllMenuRole'],
    queryAllListLoading: loading.effects['authority/quireRoleList'],
    accountList
}))(Authority);
