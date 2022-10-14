import request from '@/utils/request';

// 干部或者医生列表
export function getDoctorOrPariedList(data) {
  return request({
    url: '/assist/list',
    method: 'post',
    // params:data,
    data,
  });
}

// 添加干部档案或者医生档案
export function addDoctorOrParied(data) {
  return request({
    url: '/assist/add',
    method: 'post',
    // params:data
    data,
  });
}

// 编辑干部档案或者医生档案
export function editDcotorOrParied(data) {
  return request({
    url: '/assist/edit',
    method: 'post',
    // params:data
    data,
  });
}

// 查看干部档案或者医生档案
export function lookDoctorOrPaired(data) {
  return request({
    url: '/assist/info',
    method: 'post',
    // params:data,
    data,
  });
}
