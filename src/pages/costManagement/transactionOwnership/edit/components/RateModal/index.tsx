import React, { useState, useEffect } from "react";
import { Modal, Input, DatePicker, message } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { addManageRate } from '../../../../services';

const RecordModal: React.FC<{}> = props => {
	const { visible, title, productId, onSubmit, onCancel } = props;

	const [rate, setRate] = useState('');
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');

	const onChangeRate = e => {
		setRate(e.target.value);
	};
	const onChangeStartTime = (date, dateString) => {
		setStartTime(dateString);
	};
	const onChangeEndTime = (date, dateString) => {
		setEndTime(dateString);
	};

	const handleSubmit = () => {
		if (!rate) {
			message.error('请填写管理费率');
			return;
		}
		let params = {
			manageRate: rate,
			startTime,
			endTime,
			productIds: [productId]
		};
		handleSaveRate(params);
	};

	const handleSaveRate = async data => {
		const res = await addManageRate(data);
		if (+res.code === 1001) {
			message.info('修改成功');
			onSubmit();
		}
	}

	const disabledStartDate = current => {
		return current && current > moment(endTime).startOf('day');
	};

	const disabledEndDate = current => {
		return current && current < moment(startTime).startOf('day');
	};
	return (
		<Modal title={title ? title : "修改管理费率"} visible={visible} width={680} onOk={handleSubmit} onCancel={onCancel}>
			<div className={styles.container}>
				<div className={styles.rate}>
					管理费率：
					<Input
						type="number"
						value={rate}
						min={0}
						max={100}
						suffix="%"
						onChange={onChangeRate}
						style={{ width: 120 }}
					/>
					<span className={styles.tip} style={{ marginLeft: 60 }}>
						当日管理费 = 产品当日资产规模 x 管理费率
					</span>
				</div>
				<div className={styles.rate}>
					生效时间：
					<DatePicker value={startTime ? moment(startTime) : null} onChange={onChangeStartTime} className={styles.datePicker} style={{ marginLeft: 0 }} disabledDate={disabledStartDate} />
					至
					<DatePicker value={endTime ? moment(endTime) : null} onChange={onChangeEndTime} className={styles.datePicker} disabledDate={disabledEndDate} />
				</div>
				<div className={styles.tip}>
					<p>1、一个产品可同时配置多条管理费，但管理费生效时间不可重叠</p>
					<p>2、开始时间不填，则代表从产品成立日开始</p>
					<p>3、结束时间为空，则代表到产品清算日结束</p>
				</div>
			</div>
		</Modal>
	)
}

export default RecordModal;
