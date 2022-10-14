import request from '@/utils/request';
// 账号列表
export function getAccountList(data) {
  return request({
    url: '/admin/lists',
    method: 'post',
    data
  })
}
// 添加账号
export function addAccountList(data) {
  return request({
    url: '/admin/create',
    method: 'post',
    data
  });
}

// 编辑账号
export function editAccountList(data) {
  return request({
    url: '/admin/edit',
    method: 'post',
    data
  });
}

// 禁用账号
export function disableUser(data) {
  return request({
    url: "/admin/disable",
    method: 'post',
    data
  });
}
// 删除账号
export function deleteUserInfo(data) {
  return request({
    url: '/admin/delete',
    method: 'post',
    data
  });
}

export function zzdAccessToken(data) {
  return request({
    url: '/zzd/accessToken',
    method: 'post',
    data
  });
}

export function zzdTicket(data) {
  return request({
    url: '/zzd/ticket',
    method: 'post',
    data
  });
}

export function adminCreate(data) {
  return request({
    url: '/admin/create',
    method: 'post',
    data
  });
}

export function zzdAuthUserInfo(data) {
  return request({
    url: '/zzd/auth/userInfo',
    method: 'post',
    data
  });
}


