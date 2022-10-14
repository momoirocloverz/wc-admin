import request from '@/utils/request'

// 城镇
export function TownInfo(){
    return request({
        url:'/public/town',
        method:'post'
    })
}

// 乡村
export function VillageInfo(data){
    return request({
        url:'/public/village',
        method:'post',
        data
    })
}

// 图片上传
export function UploadPic(data){
    return request({
        url:'/public/upload',
        method:'post',
        data
    })
}