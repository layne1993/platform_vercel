export function renderTree(arr = []) {
    let filterArr;
    arr.forEach((item) => (item.children = []));
    let newArr = [];
    filterArr = arr.filter((item) => item.parentCode !== null);
    newArr.push(...arr.filter((item) => item.parentCode === null));
    pushChildren(newArr, filterArr);
    return newArr;
}

function pushChildren(newArr, filterArr) {
    if (filterArr.length) {
        newArr.forEach((item) => {
            item.children.push(
                ...filterArr.filter((item2) => item2.parentCode === item.targetCode),
            );
            filterArr = filterArr.filter((item2) => item2.parentCode !== item.targetCode);
            pushChildren(item.children, filterArr);
        });
    }
}

export const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.targetCode === key)) {
                parentKey = node.targetCode;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};
