import React from 'react';
import LoadingImg from '@/assets/Loading.gif';
import _styles from './index.less';


const Loading = () => {
    return <div className={_styles.content}>
        加载中...
        {/* <img src={LoadingImg} alt="" srcset=""/> */}
    </div>;
};

export default Loading;
