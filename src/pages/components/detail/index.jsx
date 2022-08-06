/*
 * @Descripttion: 详情组件
 * @version:
 * @Author: yezi
 * @Date: 2020-11-10 16:13:06
 * @LastEditTime: 2020-11-30 18:47:34
 */

/**
  * @description data 数据demo
  *
  *   data = [
  *  {label: '姓名', value:'张三'},
  *  {label: '性别', value: '男'}
  * ]
  *
  *
  */

import React, { PureComponent } from 'react';
import { Modal, Row, Col } from 'antd';
import styles from './index.less';


class Detail extends PureComponent {

    static defaultProps = {
        title: '详情',
        modalFlag: false,
        width: 800, // 模态框的宽度
        columnNum: 2, //一行展示几列数据
        closeModal:()=> {}, // 关闭模态框回调
        data: [] // 详情数据
    }


    /**
     * 关闭模态框
     */
    closeModal = () => {
        if (this.props.closeModal) {
            this.props.closeModal();
        }
    };


    render() {
        const {
            modalFlag = false,
            title,
            width,
            columnNum,
            data
        } = this.props;

        return (
            <Modal
                title={title}
                visible={modalFlag}
                onCancel={this.closeModal}
                width={width}
                footer={null}
                className={styles.detailModal}
            >
                <Row>
                    {
                        data.map((item, index) => {
                            return ( <Col key={index} span={24 / columnNum} >
                                <div className={styles.itemWarp} >
                                    <p className={styles.label}>{item.label}<span>：</span></p>
                                    <p className={styles.value}>{item.value}</p>
                                </div>
                            </Col>);
                        })
                    }
                    {/* <Col span={24 / columnNum} >
                        <div className={styles.itemWarp} >
                            <p className={styles.label}>姓名<span>：</span></p>
                            <p className={styles.value}>张三</p>
                        </div>
                    </Col>
                    <Col span={24 / columnNum} >
                        <div className={styles.itemWarp} >
                            <p className={styles.label}>性别<span>：</span></p>
                            <p className={styles.value}>男</p>
                        </div>
                    </Col>
                    <Col span={24 / columnNum} >
                        <div className={styles.itemWarp} >
                            <p className={styles.label}>年龄<span>：</span></p>
                            <p className={styles.value}>20</p>
                        </div>
                    </Col>
                    <Col span={24 / columnNum} >
                        <div className={styles.itemWarp} >
                            <p className={styles.label}>籍贯<span>：</span></p>
                            <p className={styles.value}>上海</p>
                        </div>
                    </Col> */}
                </Row>
            </Modal>
        );
    }
}

export default Detail;
