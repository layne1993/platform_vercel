import { Link } from 'umi';
import { Result, Button } from 'antd';
import React from 'react';
import { clearCookie } from '@/utils/utils';

export default () => (
    <Result
        status="403"
        title="您暂无查看权限"
        style={{
            background: 'none'
        }}
        subTitle="对不起,您的账号暂无当前权限,请退出后选择可访问的账号登录"
        extra={
            <Link to="/">
                <Button type="primary" onClick={()=>clearCookie()}>重新登录</Button>
            </Link>
        }
    />
);
