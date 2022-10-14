import request from '@/utils/request';

// 列表
export function ListInfo(data){
    return request({
        url:'/article/lists',
        method:'post',
        data   
    })
} 


// 添加
export function AddInfo(data){
    return request({
        url:'/article/add',
        method:'post',
        data
    })
}

// 修改
export function EditInfo(data){
    return request({
        url:'/article/edit',
        method:'post',
        data
    })
}

// 删除
export function DeleteInfo(data){
    return request({
        url:'/article/delete',
        method:'post',
        data
    });
}

// 置顶
export function editTopItem(data){
    return request({
        url:'/article/editTop',
        method:'post',
        data
    });
}

// 首页推荐
export function editRecommendItem(data){
    return request({
        url:'/article/editRecommend',
        method:'post',
        data
    });
}