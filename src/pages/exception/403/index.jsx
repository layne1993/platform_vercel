import { Link } from 'umi';
import { Result, Button } from 'antd';
import React from 'react';

export default () => (
    <Result
        status="403"
        title="403"
        style={{
            background: 'none'
        }}
        subTitle="抱歉，您无权访问此页。"
        extra={
            <Link to="/">
                <Button type="primary">请先去登录!</Button>
            </Link>
        }
    />
);
