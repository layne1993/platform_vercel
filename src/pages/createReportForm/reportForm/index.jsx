/*
 * @description: 生成报表
 * @Author: tangsc
 * @Date: 2021-03-29 10:01:22
 */
import React, { useEffect, useState } from 'react';
import { Space } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import { reportFormLogo } from '@/utils/staticResources';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import Filter from './components/Filter';
import Logo from './components/Logo';
import ProductInfo from './components/ProductInfo';
import TrendChart from './components/TrendChart';
import FieldConfig from './components/FieldConfig';
import ShowTableData from './components/ShowTableData';
import AssetsSpread from './components/AssetsSpread';
import TitleAndTextConfig from './components/TitleAndTextConfig';
import TipsConfig from './components/TipsConfig';
import jsPDF1 from './Public/ToPDF';
import { isEmpty } from 'lodash';

const ReportForm = (props) => {

    const { dispatch, createReportForm } = props;
    const {
        customFormData = {},
        isProductInfo,
        isNetValueTrends,
        isHistoricalIncomes,
        isStatisticalTable,
        assetAllocation,
        isText,
        isImportantNote
    } = createReportForm;

    const titleAndTextRef = React.createRef();

    const imageCode = (name) => {
        let printDoc = document.getElementById('div_print');
        jsPDF1(printDoc, true, name);
    };

    // 组件卸载时数据处理
    const _unmount = () => {
        dispatch({
            type: 'createReportForm/clearData'
        });
    };

    useEffect(() => {
        return _unmount;
    }, []);

    return (
        <PageHeaderWrapper title="产品披露报表" >
            <GridContent>
                <Filter forwardRef={titleAndTextRef} toPdf={imageCode} />
                <Space
                    className={styles.container}
                    size="middle"
                    direction="vertical"
                    id="div_print"
                >
                    {
                        !isEmpty(customFormData) ? <Logo /> : null
                    }
                    {
                        isProductInfo && <ProductInfo />
                    }
                    {
                        isNetValueTrends && <TrendChart />
                    }
                    {
                        isHistoricalIncomes && <FieldConfig />
                    }
                    {
                        isStatisticalTable && <ShowTableData />
                    }
                    {
                        assetAllocation && <AssetsSpread />
                    }
                    {
                        isText && <TitleAndTextConfig formRef={titleAndTextRef} />
                    }
                    {
                        isImportantNote && <TipsConfig />
                    }
                </Space>
            </GridContent>
        </PageHeaderWrapper>
    );
};

export default connect(({ createReportForm }) => ({
    createReportForm
}))(ReportForm);
