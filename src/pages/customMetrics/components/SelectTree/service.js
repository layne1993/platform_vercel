import request from '@/utils/rest';

export async function queryTreeList(params) {
    return request.postForm('/productTarget/default/list', params);
}
