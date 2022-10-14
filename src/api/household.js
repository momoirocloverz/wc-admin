import request from '@/utils/request';

// 农户列表
export function ListUser(data) {
  return request({
    url: '/user/lists',
    method: 'post',
    data,
    // params:data
  });
}

// 删除数据
export function DeleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data,
    // params:data
  });
}

// 修改数据
export function EditUser(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    // params:data
    data,
  });
}

// 新增用户
export function AddUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    // params:data
    data,
  });
}

// 获取用户基础信息
export function GetBaseInfo(data) {
  return request({
    url: '/user/info',
    method: 'post',
    data,
  });
}

// 干部结对信息
export function GetGBJDInfo(data) {
  return request({
    url: '/user/info/gbjd',
    method: 'post',
    data,
  });
}

// 医生结对信息
export function GetDoctorInfo(data) {
  return request({
    url: '/user/info/ysjd',
    method: 'post',
    data,
  });
}

//  获取就医详情信息
export function GetDoctorDetailInfo(data) {
  return request({
    url: '/user/info/jyxq',
    method: 'post',
    data,
  });
}

// 导入
export function ExportHouseInfo(data) {
  return request({
    url: '/user/import/nhxx',
    method: 'post',
    data,
  });
}

// 校验干部和医生的信息
export function PairedAndDoctorInfo(data) {
  return request({
    url: '/assist/search',
    method: 'post',
    data,
  });
}

export function userInfoZjqk(data) {
  return request({
    url: '/user/info/zjqk',
    method: 'post',
    data,
  });
}
