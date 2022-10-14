import request from '@/utils/request'

// 列表
export function ListInfo(data) {
  return request({
    url: '/message/lists',
    method: 'post',
    data
  })
}

// 新增
export function AddInfo(data) {
  return request({
    url: '/message/add',
    method: 'post',
    data
  })
}

// 修改
export function EditInfo(data) {
  return request({
    url: '/message/edit',
    method: 'post',
    data
  })
}

// 删除
export function DeleteInfo(data) {
  return request({
    url: '/message/delete',
    method: 'post',
    data
  })
}

/*
 *  农产品 就业信息相关
 * */

// 农产品、就业信息列表
export function CheckList(data) {
  return request({
    url: '/issue_message/list',
    method: 'post',
    data
  })
}

// 信息详情
export function CheckDetail(data) {
  return request({
    url: '/issue_message/info',
    method: 'post',
    data
  })
}

// 删除信息
export function DeleteMessage(data) {
  return request({
    url: '/issue_message/delete',
    method: 'post',
    data
  })
}

export function AddMessage(data) {
  return request({
    url: '/issue_message/add',
    method: 'post',
    data
  })
}

export function EditMessage(data) {
  return request({
    url: '/issue_message/edit',
    method: 'post',
    data
  })
}

export function articleEditFlow(data) {
  return request({
    url: '/article/flow/edit',
    method: 'post',
    data
  })
}

export function articleFlow(data) {
  return request({
    url: '/article/flow/info',
    method: 'post',
    data
  })
}

export function propertyList(data) {
  return request({
    url: '/property/list',
    method: 'post',
    data
  })
}

export function propertyInfo(data) {
  return request({
    url: '/property/info',
    method: 'post',
    data
  })
}
export function propertyEdit(data) {
  return request({
    url: '/property/edit',
    method: 'post',
    data
  })
}
export function propertyDelete(data) {
  return request({
    url: '/property/delete',
    method: 'post',
    data
  })
}

export function propertyType(data) {
  return request({
    url: '/property/type',
    method: 'post',
    data
  })
}

export function skillList(data) {
  return request({
    url: '/skill/list',
    method: 'post',
    data
  })
}

export function skillDelete(data) {
  return request({
    url: '/skill/delete',
    method: 'post',
    data
  })
}

export function skillInfo(data) {
  return request({
    url: '/skill/info',
    method: 'post',
    data
  })
}

export function skillEdit(data) {
  return request({
    url: '/skill/edit',
    method: 'post',
    data
  })
}

export function skillAdd(data) {
  return request({
    url: '/skill/add',
    method: 'post',
    data
  })
}

export function skillTypeList(data) {
  return request({
    url: '/skill/type/list',
    method: 'post',
    data
  })
}

export function skillTypeAdd(data) {
  return request({
    url: '/skill/type/add',
    method: 'post',
    data
  })
}

export function skillTypeDelete(data) {
  return request({
    url: '/skill/type/delete',
    method: 'post',
    data
  })
}

export function issue_messageTypeList(data) {
  return request({
    url: '/issue_message/type/list',
    method: 'post',
    data
  })
}

export function issue_messageTypeAdd(data) {
  return request({
    url: '/issue_message/type/add',
    method: 'post',
    data
  })
}

export function issue_messageTypeDelete(data) {
  return request({
    url: '/issue_message/type/delete',
    method: 'post',
    data
  })
}

export function propertyAdd(data) {
  return request({
    url: '/property/add',
    method: 'post',
    data
  })
}

export function auditIssue(data) {
  return request({
    url: '/issue_message/audit',
    method: 'post',
    data
  })
}
export function propertyAudit(data) {
    return request({
      url: '/property/audit',
      method: 'post',
      data
    })
  }
