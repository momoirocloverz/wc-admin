import request from '@/utils/request';
// 角色管理列表
export function getRoleManageList(data){
    return request({
        url:'/role/lists',
        method:'post',
        data
    })
}

// 权限导航列表
export function getPermiseRoleList(){
    return request({
        url:'/permission/lists',
        method:'post'
    })
}

// 创建角色
export function createRoleInfo(data){
    return request({
        url:'/role/create',
        method:'post',
        data
    })
}

// 编辑角色
export function editRoleInfo(data){
    return request({
        url:'/role/edit',
        method:'post',
        data
    })
}

// 删除角色
export function deleteRoleInfo(data){
  return request({
    url:'/role/delete',
    method:'post',
    data
  })
}

// 获取权限详情
export function getRoleListDetail(data){
    return request({
        url:'/role/info',
        method:'post',
        data
    });
}

// 获取左侧navigate
export function getNavigateList(){
    return request({
        url:'/navigate',
        method:'post'
    });
}

// 删除确认信息
export function deleteBtnOkInfo(data){
    return request({
        url:'/role/delinfo',
        method:'post',
        data
    })
}
