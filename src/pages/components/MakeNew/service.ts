import request from '@/utils/rest'

// 获取模板
export function getUnderwriterTemplate(params) {
  return request.postJSON('/stagging/template/list', params)
}

// 获取详情
export function getUnderwriterMaintain(params) {
  return request.get('/stagging/underwriter/find', params)
}

// 保存
export function saveUnderwriterMaintain(params) {
  return request.postJSON('/stagging/underwriter/createOrUpdate', params)
}

// 获取管理人详情
export function getManagerDetail(params) {
  return request.get('/stagging/relatedParty/find', params)
}

// 管理人保存
export function saveManagerDetail(params) {
  return request.postJSON('/stagging/relatedParty/createOrUpdate', params)
}