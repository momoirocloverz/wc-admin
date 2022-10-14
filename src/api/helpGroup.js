import request from "@/utils/request";
import requestBlob from "@/utils/requestBlob";

export function collectLists(data) {
  return request({
    url: "/plan/income/collect/list",
    method: "post",
    data
  });
}

export function settleLists(data) {
  return request({
    url: "/plan/income/settle/list",
    method: "post",
    data
  });
}

export function dropLists(data) {
  return request({
    url: "/plan/income/drop/list",
    method: "post",
    data
  });
}

export function refundLists(data) {
  return request({
    url: "/plan/income/refund/list",
    method: "post",
    data
  });
}

export function saveLists(data) {
  return request({
    url: "/plan/income/save/list",
    method: "post",
    data
  });
}

export function invLists(data) {
  return request({
    url: "/plan/income/inv/list",
    method: "post",
    data
  });
}

export function shareLists(data) {
  return request({
    url: "/plan/income/share/list",
    method: "post",
    data
  });
}

export function sendFund(data) {
  return request({
    url: "/plan/income/send/fund",
    method: "post",
    data
  });
}

export function incomeConfirmCollect(data) {
  return request({
    url: "/plan/income/confirm/collect",
    method: "post",
    data
  });
}

export function incomeConfirmLoan(data) {
  return request({
    url: "/plan/income/confirm/loan",
    method: "post",
    data
  });
}

export function incomeConfirmSubsidy(data) {
  return request({
    url: "/plan/income/confirm/subsidy",
    method: "post",
    data
  });
}

export function incomeConfirmShare(data) {
  return request({
    url: "/plan/income/confirm/share",
    method: "post",
    data
  });
}

export function incomeConfirmInterest(data) {
  return request({
    url: "/plan/income/confirm/interest",
    method: "post",
    data
  });
}

export function incomeConfirmSoft(data) {
  return request({
    url: "/plan/income/confirm/soft",
    method: "post",
    data
  });
}

export function incomeSendInv(data) {
  return request({
    url: "/plan/income/send/inv",
    method: "post",
    data
  });
}

export function incomeSendSubsidy(data) {
  return request({
    url: "/plan/income/send/subsidy",
    method: "post",
    data
  });
}

export function incomeSendSoft(data) {
  return request({
    url: "/plan/income/send/soft",
    method: "post",
    data
  });
}

export function incomeSendShare(data) {
  return request({
    url: "/plan/income/send/share",
    method: "post",
    data
  });
}

export function incomeConfirmInv(data) {
  return request({
    url: "/plan/income/confirm/inv",
    method: "post",
    data
  });
}

export function incomeAuditExit(data) {
  return request({
    url: "/plan/income/audit/exit",
    method: "post",
    data
  });
}

export function incomeRefund(data) {
  return request({
    url: "/plan/income/refund",
    method: "post",
    data
  });
}

export function incomeCancel(data) {
  return request({
    url: "/plan/income/cancel",
    method: "post",
    data
  });
}

export function incomeSendSettle(data) {
  return request({
    url: "/plan/income/send/settle",
    method: "post",
    data
  });
}
