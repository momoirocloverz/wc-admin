import request from "@/utils/request";
import requestBlob from "@/utils/requestBlob";
// 列表
export function PlanLists(data) {
  return request({
    url: "/plan/list",
    method: "post",
    data
  });
}
export function PlanInfo(data) {
  return request({
    url: "/plan/info",
    method: "post",
    data
  });
}
export function PlanAudit(data) {
  return request({
    url: "/plan/audit",
    method: "post",
    data
  });
}
export function batchExportPlan(params) {
  return requestBlob({
    url: "/plan/export",
    method: "get",
    responseType: "blob",
    params
  });
}

export function PlanBeeLists(data) {
  return request({
    url: "/plan/bee/list",
    method: "post",
    data
  });
}

export function PlanBeeInfo(data) {
  return request({
    url: "/plan/bee/info",
    method: "post",
    data
  });
}

export function PlanBeeAudit(data) {
  return request({
    url: "/plan/bee/audit",
    method: "post",
    data
  });
}

export function PlanBeeExport(params) {
  return requestBlob({
    url: "/plan/bee/export",
    method: "get",
    responseType: "blob",
    params
  });
}

export function PlanBeeProList(data) {
  return request({
    url: "/plan/bee/pro/list",
    method: "post",
    data
  });
}

export function PlanBeeProDelete(data) {
  return request({
    url: "/plan/bee/pro/delete",
    method: "post",
    data
  });
}

export function PlanBeeProEdit(data) {
  return request({
    url: "/plan/bee/pro/edit",
    method: "post",
    data
  });
}

export function PlanBeeProAdd(data) {
  return request({
    url: "/plan/bee/pro/add",
    method: "post",
    data
  });
}
