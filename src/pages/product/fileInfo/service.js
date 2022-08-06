import request from '@/utils/rest';


// 新增产品文件
export async function addProductFile(params) {
    return request.postJSON('/productFile/create', params);
}

// 修改产品文件
export async function editProductFile(params) {
    return request.put('/productFile/edit', params);
}

// 查询产品文件
export async function productFileDetail(params) {
    return request.get('/productFile/detail', params);
}


