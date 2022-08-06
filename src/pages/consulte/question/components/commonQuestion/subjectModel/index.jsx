import { Button, Input, Modal, Tag, Tooltip, notification, Spin } from 'antd';
import { connect } from 'umi';
import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
// 样式相关 代码
const grid = 8;
// 水平样式
const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    // margin: `0 ${grid}px 0 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle
});
const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    width: '100%'
    // display: 'flex',
    // padding: grid,
    // overflow: 'auto',
});
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};
class SetSubjectModel extends Component {
    state = {
        selectedRowKeys: '',
        showModal: false,
        datasources: {
            data: {
                homeShowCount: null,
                articleCount: null,
                subjectCount: null,
                list: []
            }
        },
        selectedRow: [],
        topInfo: {},
        userList: [],
        saleUserNameList: [],
        customerId: '',
        current: 1,
        pageNum: 1,
        pageSize: 20,
        tabeData: [],
        powerInfo: {},
        showExcalVip: false,
        vipLevel: '',
        articleColumnModel: false,
        specialCustActStatus: '',
        // 设置文章栏目
        tags: [],
        inputVisible: false,
        inputValue: '',
        editInputIndex: -1,
        editInputValue: '',
        checkoutFrontPage: false,
        showModalDel: false,
        deleteSubjectId: null,
        removedTag: '',
        canConfirm: true
    };

    componentDidMount() {
        const { consulteQuestion: { questionTypes } } = this.props;
        this.setState({ tags: questionTypes });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { consulteQuestion: { questionTypes }, saveLoading, questionTypeLoading } = nextProps || {};
        const { tags } = this.state;
        if (Object.is(questionTypes, tags)) return;
        if (saveLoading || questionTypeLoading) return;
        this.setState({ tags: questionTypes });
    }

    modalhandleOk = (e) => {
        const { selectedRowKeys } = this.state;
        if (e) {
            this.setState({
                showExcal: false
            });
        } else {
            this.determine(selectedRowKeys);
            this.setState({
                showModal: false
            });
        }
    }

    modalhandleCancelDel = () => {
        this.setState({
            showModalDel: false
        });
    }

    modalhandleOkDel = () => {
        const { removedTag } = this.state;
        const tags = this.state.tags.filter((tag) => tag !== removedTag);
        this.setState({
            tags,
            showModalDel: false
        });
    }
    // 设置文章栏目
    setArticleColumn = () => {
        const { consulteQuestion: { questionTypes } } = this.props;
        this.setState({
            tags: questionTypes,
            articleColumnModel: true
        });
    }

    customerhandleCancel = () => {
        this.setState({
            articleColumnModel: false,
            editInputIndex: null,
            inputVisible:false
        });
    }

    articleColumnSaveOk = () => {
        if (!this.state.canConfirm) {
            openNotification('warning', '类型名称未填写或填写错误', '', 'topRight');
            return;
        }
        const { tags } = this.state;
        this.setState({
            editInputIndex: null
        });
        this.saveSubjectColumn(tags);
    }

    // 设置类型标题
    handleClose = (e, removedTag) => {
        // const tags = this.state.tags.filter(tag => tag !== removedTag);
        // this.setState({ tags });
        e.preventDefault();
        let id = removedTag.id;
        this.setState({
            removedTag,
            deleteSubjectId: id
        });
        this.setState({
            showModalDel: true
        });
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = () => {
        const { inputValue, tags } = this.state;
        //   inputValue不能时空格  同时在判断问题类型是否相同时需要去掉中间空格
        if (!(inputValue.replace(/\s+/g, ''))) {
            openNotification('warning', '类型名称不能为空', '', 'topRight');
            this.setState({ canConfirm: false });
            return;
        }
        let t = tags;
        const result = tags.some((item) => {
            if (!item.codeText) {
                openNotification('warning', '类型名称不能为空', '', 'topRight');
                this.setState({ canConfirm: false });
                return true;
            }
            if (item.codeText.replace(/\s+/g, '') === inputValue.replace(/\s+/g, '')) {
                openNotification('warning', '请设置不同的类型名称', '', 'topRight');
                this.setState({ canConfirm: false });
                return true;
            }
        });
        if (result) {
            return;
        }
        if (inputValue && !result) {
            t = [
                ...tags,
                {
                    codeText: inputValue
                }];
        }
        this.setState({
            tags: t,
            inputVisible: false,
            inputValue: '',
            canConfirm:true
        });
    };

    handleEditInputChange = (e) => {
        this.setState({ editInputValue: e.target.value });
    };

    handleEditInputConfirm = () => {
        const { editInputValue, tags } = this.state;
        //   inputValue不能时空格  同时在判断问题类型是否相同时需要去掉中间空格
        if (!(editInputValue.replace(/\s+/g, ''))) {
            openNotification('warning', '类型名称不能为空', '', 'topRight');

            this.setState({
                canConfirm: false,
                editInputIndex: null
            });
            return;
        }
        const result = tags.some((item, index) => {
            if (index === this.state.editInputIndex) { // 不去与当前编辑的输入框做对比
                return false;
            }
            if (item.codeText.replace(/\s+/g, '') === editInputValue.replace(/\s+/g, '')) {
                this.setState({
                    canConfirm: false
                });
                openNotification('warning', '请设置不同的类型名称', '', 'topRight');
                return true;
            }
        });
        if (result) {
            return;
        }
        this.setState(({ tags, editInputIndex, editInputValue }) => {
            const newTags = [...tags];
            newTags[editInputIndex].codeText = editInputValue;
            return {
                tags: newTags,
                editInputIndex: -1,
                editInputValue: '',
                canConfirm: true
            };
        });
    };

    saveInputRef = (input) => {
        this.input = input;
    };

    saveEditInputRef = (input) => {
        this.editInput = input;
    };

    // 增加排序
    // 确定保存
    saveSubjectColumn = (params) => {
        const { dispatch, getQuestionType } = this.props;
        dispatch({
            type: 'consulteQuestion/addQuestionType',
            payload: {
                sysCodelistList: params
            },
            callback: (res) => {
                if (res.code === 1008) {
                    getQuestionType();
                    this.setState({
                        articleColumnModel: false
                    });
                    openNotification('success', '提示', res.message || '保存成功', 'topRight', 5);
                } else {
                    const warningText = res.message || res.data || '保存失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });

    }
    reOrder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const items = this.reOrder(
            this.state.tags,
            result.source.index,
            result.destination.index
        );
        this.setState({
            tags: items
        });
    }

    renderTags() {
        const { tags, inputVisible, inputValue, editInputIndex, editInputValue, showModalDel } = this.state;
        return (
            <>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable" direction="vertical">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                {...provided.droppableProps}
                            >
                                {tags.map((tag, index) => {
                                    if (editInputIndex === index) {
                                        return (
                                            <Input
                                                ref={this.saveEditInputRef}
                                                key={tag.codeText}
                                                size="small"
                                                className="tag-input"
                                                value={editInputValue}
                                                onChange={this.handleEditInputChange}
                                                onBlur={this.handleEditInputConfirm}
                                                onPressEnter={this.handleEditInputConfirm}
                                            />
                                        );
                                    }
                                    const isLongTag = tag.codeText.length > 20;
                                    const tagElem = (
                                        <Tag
                                            className="edit-tag"
                                            key={tag.codeText}
                                            closable={index !== 0}
                                            onClose={(e) => this.handleClose(e, tag)}
                                        >
                                            <span
                                                onDoubleClick={(e) => {
                                                    // if (index !== 0) {
                                                    this.setState({ editInputIndex: index, editInputValue: tag.codeText }, () => {
                                                        this.editInput.focus();
                                                    });
                                                    e.preventDefault();
                                                    // }
                                                }}
                                            >
                                                {isLongTag ? `${tag.codeText.slice(0, 20)}...` : tag.codeText}
                                            </span>
                                        </Tag>

                                    );
                                    return isLongTag ? (
                                        <Tooltip title={tag.codeText} key={tag.codeText}>
                                            {tagElem}
                                        </Tooltip>
                                    ) : (
                                        <Draggable key={tag.codeText} draggableId={tag.codeText} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    {tagElem}
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {inputVisible && (
                                    <Input
                                        ref={this.saveInputRef}
                                        type="text"
                                        size="small"
                                        className="tag-input"
                                        value={inputValue}
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleInputConfirm}
                                        onPressEnter={this.handleInputConfirm}
                                    />
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                {!inputVisible && (
                    <Tag className="site-tag-plus" onClick={this.showInput}>
                        <PlusOutlined /> 类型
                    </Tag>
                )}
            </>
        );
    }

    render() {
        const { saveLoading, questionTypeLoading } = this.props;
        const { articleColumnModel, showModalDel } = this.state;
        return (
            <div>
                <Modal
                    // title="提示"
                    visible={showModalDel}
                    closable={false}
                    footer={
                        <>
                            <Button onClick={() => this.modalhandleOkDel(0)} type="primary">是</Button>
                            <Button onClick={this.modalhandleCancelDel}>否</Button>
                        </>
                    }
                >
                    <div className={styles.CloseICon}>
                        <p><CloseCircleOutlined style={{ color: 'red', fontSize: 18 }} /> 请您确认是否删除该类型</p>
                        <p style={{ marginTop: 10 }}>删除该栏目后，该类型下的所有的“问题信息”的类型都将为空，需要重新设置，确定保存后生效</p>
                    </div>
                </Modal>
                <Modal
                    className={styles.conlumnSortModel}
                    title="请设置问题类型"
                    visible={articleColumnModel}
                    closable={false}
                    mask={false}
                    maskClosable={false}
                    footer={
                        <>
                            <Button onClick={this.articleColumnSaveOk} type="primary">确定</Button>
                            <Button onClick={this.customerhandleCancel}>取消</Button>
                        </>
                    }
                >
                    <div className={styles.modalContentBox} style={{ textAlign: 'center' }}>
                        {/* <Search placeholder="请输入搜索栏目" onSearch={this.onSearchColumnName()} enterButton /> */}
                        {this.renderTags()}
                        {
                            (saveLoading || questionTypeLoading) && (
                                <div className={styles.consulteQestionModalLoading}>
                                    <Spin />
                                </div>
                            )
                        }
                    </div>
                </Modal>
                <a type="primary" className={styles.newBuildSubject} onClick={this.setArticleColumn}>
                    添加类型
                </a>
            </div>
        );
    }
}

export default connect(({ consulteQuestion, loading }) => ({
    consulteQuestion,
    saveLoading: loading.effects['consulteQuestion/addQuestionType'],
    questionTypeLoading: loading.effects['consulteQuestion/getQuestionType']
}))(SetSubjectModel);
