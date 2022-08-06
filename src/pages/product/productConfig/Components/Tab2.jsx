/*
 * @description:产品设置信息
 * @Author: tangsc
 * @Date: 2020-12-23 16:47:09
 */
import React, { PureComponent } from 'react';
import styles from './styles/Tab2.less';
import { Card, Tree } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CaretDownOutlined } from '@ant-design/icons';


const doubleTreeData = [
    {
        title: '使用IA双录的产品',
        key: '0-0',
        children: [
            {
                title: '使用系统模板产品',
                key: '0-0-0',
                children: [
                    {
                        title: '产品2',
                        key: '0-0-0-0'
                    },
                    {
                        title: '产品3',
                        key: '0-0-0-1'
                    },
                    {
                        title: '产品4',
                        key: '0-0-0-2'
                    }
                ]
            },
            {
                title: '使用自定义模板产品',
                key: '0-0-1',
                children: [
                    {
                        title: '产品5',
                        key: '0-0-1-0'
                    },
                    {
                        title: '产品6',
                        key: '0-0-1-1'
                    },
                    {
                        title: '产品7',
                        key: '0-0-1-2'
                    }
                ]
            }
        ]
    },
    {
        title: '使用普通双录的产品',
        key: '0-1',
        children: [
            {
                title: '使用系统模板产品',
                key: '0-1-0',
                children: [
                    {
                        title: '产品8',
                        key: '0-1-0-0'
                    },
                    {
                        title: '产品9',
                        key: '0-1-0-1'
                    },
                    {
                        title: '产品10',
                        key: '0-1-0-2'
                    }
                ]
            },
            {
                title: '使用自定义模板产品',
                key: '0-1-1',
                children: [
                    {
                        title: '产品11',
                        key: '0-1-1-0'
                    },
                    {
                        title: '产品12',
                        key: '0-1-1-1'
                    },
                    {
                        title: '产品13',
                        key: '0-1-1-2'
                    }
                ]
            }
        ]
    }
];

const coldTreeData = [
    {
        title: '客户手动开启冷静期的产品',
        key: 'a',
        children: [
            {
                title: '产品1',
                key: 'a-1'
            },
            {
                title: '产品2',
                key: 'a-2'
            },
            {
                title: '产品3',
                key: 'a-3'
            }
        ]
    },
    {
        title: '资金流水开启冷静期的产品',
        key: 'b',
        children: [
            {
                title: '产品4',
                key: 'b-1'
            },
            {
                title: '产品5',
                key: 'b-2'
            },
            {
                title: '产品6',
                key: 'b-3'
            }
        ]
    }
];


// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 2,
    margin: '0 0 2px 0',

    // change background colour if dragging
    background: isDragging ? '#BAE7FF' : '',

    // styles we need to apply on draggables
    ...draggableStyle
});

// const getListStyle = (isDraggingOver) => ({
//     background: isDraggingOver ? 'lightblue' : 'lightgrey',
//     padding: grid,
//     width: 250
// });

class Tab2 extends PureComponent {
    state = {
        items: getItems(10),
        selected: getItems(5, 10),
        isShowSign: true,
        isShowNoSign: true,
        expandedKeys: ['0-0-0', '0-0-1', '0-1-0', '0-1-1'],
        autoExpandParent: true,
        coldExpandedKeys: ['a', 'b'],
        coldAutoExpandParent: true
    };

    onExpand = (expandedKeys) => {
        // console.log('onExpand', expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.

        this.setState({
            expandedKeys,
            autoExpandParent: false
        });
    };

    onColdExpand = (expandedKeys) => {
        // console.log('onExpand', expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.

        this.setState({
            coldExpandedKeys: expandedKeys,
            coldAutoExpandParent: false
        });
    };
    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    getList = (id) => this.state[this.id2List[id]];

    onDragEnd = (result) => {
        const { source, destination } = result;
        // console.log('result', result);
        // console.log('source', source);
        // console.log('destination', destination);
        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { selected: items };
            }

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                items: result.droppable,
                selected: result.droppable2
            });
        }
    };

    _handleClick = (type) => {
        const { isShowSign, isShowNoSign } = this.state;
        if (type === 'sign') {
            if (isShowSign) {
                document.getElementById('signIcon').style.transform = 'rotate(-90deg)';
                document.getElementById('signBox').style.height = 0;
            } else {
                document.getElementById('signIcon').style.transform = 'rotate(0deg)';
                document.getElementById('signBox').style.height = '300px';
            }
        } else {
            if (isShowNoSign) {
                document.getElementById('noSignIcon').style.transform = 'rotate(-90deg)';
                document.getElementById('noSignBox').style.height = 0;
            } else {
                document.getElementById('noSignIcon').style.transform = 'rotate(0deg)';
                document.getElementById('noSignBox').style.height = '300px';
            }
        }

        if (type === 'sign') {
            this.setState({
                isShowSign: !isShowSign
            });
        } else {
            this.setState({
                isShowNoSign: !isShowNoSign
            });
        }

    }
    render() {
        const { expandedKeys, autoExpandParent, coldExpandedKeys, coldAutoExpandParent } = this.state;
        return (
            <div className={styles.container}>
                <Card>
                    <div className={styles.wrapper}>
                        <div className={styles.signTypeWrapper}>
                            <p>
                                产品签约类型列表<br />
                                <span>（可拖动产品名称改变签约类型）：</span>
                            </p>
                            <DragDropContext onDragEnd={this.onDragEnd} >
                                <div className={styles.signIcon}>
                                    <CaretDownOutlined onClick={() => this._handleClick('sign')} id="signIcon" />&nbsp;&nbsp;电子合同签约产品
                                </div>
                                {/* {
                                    isShowSign && */}
                                <Droppable droppableId="droppable">
                                    {
                                        (provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                className={styles.itemBox}
                                                id="signBox"
                                            // style={getListStyle(snapshot.isDraggingOver)}
                                            >
                                                {this.state.items.map((item, index) => (
                                                    <Draggable
                                                        key={item.id}
                                                        draggableId={item.id}
                                                        index={index}
                                                    >
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
                                                                {item.content}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                </Droppable>
                                {/* } */}
                                <div className={styles.signIcon}>
                                    <CaretDownOutlined onClick={() => this._handleClick('noSign')} id="noSignIcon" />&nbsp;&nbsp;非电子合同签约产品
                                </div>
                                <Droppable droppableId="droppable2">
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            className={styles.itemBox}
                                            id="noSignBox"
                                        // style={getListStyle(snapshot.isDraggingOver)}
                                        >
                                            {this.state.selected.map((item, index) => (
                                                <Draggable
                                                    key={item.id}
                                                    draggableId={item.id}
                                                    index={index}
                                                >
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
                                                            {item.content}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                        <div className={styles.doubleConfigWrapper}>
                            <p>
                                产品双录类型列表<br />
                                <span>（如需修改双录类型，请进产品详细内修改）：</span>
                            </p>
                            <Tree
                                onExpand={this.onExpand}
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                treeData={doubleTreeData}
                            />
                        </div>
                        <div className={styles.coolingPeriodWrapper}>
                            <p>
                                产品签约冷静期开启类型列表：<br />
                                <span>&nbsp;</span>
                            </p>
                            <Tree
                                onExpand={this.onColdExpand}
                                expandedKeys={coldExpandedKeys}
                                autoExpandParent={coldAutoExpandParent}
                                treeData={coldTreeData}
                            />
                        </div>
                    </div>
                </Card>
            </div>

        );
    }
}
export default Tab2;
