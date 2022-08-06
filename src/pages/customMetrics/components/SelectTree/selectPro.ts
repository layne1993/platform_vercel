interface SelectTreeInt {
    targetName: string;
    parentCode: string;
    targetCode: string;
    enable: boolean | undefined;
}

interface CustomMetricsSelectTree {
    renderArr: SelectTreeInt[];
    checkedKeys: React.Key[];
}

export interface SelectTreePro {
    customMetricsSelectTree: CustomMetricsSelectTree;
    loading: boolean;
    dispatch: any;
}
