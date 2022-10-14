import request from "@/utils/request";
import requestBlob from "@/utils/requestBlob";

// 列表
export function ListCode(data) {
  return request({
    url: "/user/lists",
    method: "post",
    data
  });
}

// 删除用户
export function DeleteCode(data) {
  return request({
    url: "/user/delete",
    method: "post",
    data
  });
}

// 编辑用户
export function EditCode(data) {
  return request({
    url: "/user/edit",
    method: "post",
    data
  });
}

// 导出小康码
export function ExportSmallCode(data) {
  return request({
    url: "/user/export",
    method: "post",
    data
  });
}

// 批量导出小康码
export function batchExportCode(params) {
  return requestBlob({
    url: "/user/export/xkm",
    method: "get",
    responseType:'blob',
    params
  });
}
