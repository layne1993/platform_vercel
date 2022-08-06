import { Space } from 'antd';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { connect } from 'umi';
import Avatar from './AvatarDropdown';

import Preview from './Preview';

// import HeaderSearch from '../HeaderSearch';
// import SelectLang from '../SelectLang';
import styles from './index.less';

// const ENVTagColor = {
//   dev: 'orange',
//   test: 'green',
//   pre: '#87d068',
// };

const GlobalHeaderRight = (props) => {
    const { theme, layout } = props;
    let className = styles.right;

    if (theme === 'dark' && layout === 'topmenu') {
        className = `${styles.right}  ${styles.dark}`;
    }

    return (
        <div className={className}>
            <Space>
                {BASE_PATH.isSaas === 2 && <Preview />}
                <Avatar />
            </Space>
        </div>
    );
};

export default connect(({ settings }) => ({
    theme: settings.navTheme,
    layout: settings.layout
}))(GlobalHeaderRight);
