import React, { useState } from 'react';
import { Modal, Form, Select, Button, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Option } = Select;

const MatchModal: React.FC<{}> = props => {
	const { visible, onOk, onCancel } = props;

	return (
		<Modal visible={visible} width={600} title="行业分类设置" onOk={onOk} onCancel={onCancel}>
			<div className={styles.container}>
				<Form name="dynamic_form_nest_item" autoComplete="off">
					<Form.List name="users">
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, fieldKey, ...restField }) => (
									<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
										<Form.Item
											{...restField}
											label="分类选择："
											name={[name, 'first']}
											fieldKey={[fieldKey, 'first']}
											rules={[{ required: true }]}
										>
											<Select className={styles.selectBox}>
												<Option value={1}>1</Option>
											</Select>
										</Form.Item>
										<Form.Item
											{...restField}
											label="匹配行业："
											name={[name, 'last']}
											fieldKey={[fieldKey, 'last']}
											rules={[{ required: true }]}
										>
											<Select className={styles.selectBox}>
												<Option value={1}>1</Option>
											</Select>
										</Form.Item>
										<MinusCircleOutlined onClick={() => remove(name)} />
									</Space>
								))}
								<Form.Item>
									<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
										新增
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
				</Form>
			</div>
		</Modal>
	)
};

export default MatchModal;
