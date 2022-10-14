import request from '@/utils/request';
import requestBlob from '@/utils/requestBlob';

export function beeAccessLists(data) {
  return request({
    url: '/plan/bee/access/list',
    method: 'post',
    data,
  });
}

export function majorManageLists(data) {
  return request({
    url: '/plan/bee/MajorManage/list',
    method: 'post',
    data,
  });
}

export function beeMajorManageExport(data) {
  return requestBlob({
    url: '/plan/bee/MajorManage/export',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function majorManageImport(data) {
  return request({
    url: '/plan/bee/MajorManage/import',
    method: 'post',
    data,
  });
}

export function majorManageReceipt(data) {
  return request({
    url: '/plan/bee/MajorManage/receipt',
    method: 'post',
    data,
  });
}

export function majorManageRemit(data) {
  return request({
    url: '/plan/bee/MajorManage/remit',
    method: 'post',
    data,
  });
}

export function majorManageDelete(data) {
  return request({
    url: '/plan/bee/MajorManage/delete',
    method: 'post',
    data,
  });
}

export function majorManageEdit(data) {
  return request({
    url: '/plan/bee/MajorManage/edit',
    method: 'post',
    data,
  });
}

export function majorManageInfo(data) {
  return request({
    url: '/plan/bee/MajorManage/info',
    method: 'post',
    data,
  });
}

export function farmerManageList(data) {
  return request({
    url: '/plan/bee/farmerManage/list',
    method: 'post',
    data,
  });
}

export function farmerManageRemit(data) {
  return request({
    url: '/plan/bee/farmerManage/remit',
    method: 'post',
    data,
  });
}

export function beeFarmerManageExport(data) {
  return requestBlob({
    url: '/plan/bee/farmerManage/export',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function farmerManageReceipt(data) {
  return request({
    url: '/plan/bee/farmerManage/receipt',
    method: 'post',
    data,
  });
}

export function farmerManageTrainInfo(data) {
  return request({
    url: '/plan/bee/farmerManage/trainInfo',
    method: 'post',
    data,
  });
}

export function farmerManageWorkInfo(data) {
  return request({
    url: '/plan/bee/farmerManage/workInfo',
    method: 'post',
    data,
  });
}

export function farmerManageInfo(data) {
  return request({
    url: '/plan/bee/farmerManage/info',
    method: 'post',
    data,
  });
}

export function farmerManageEdit(data) {
  return request({
    url: '/plan/bee/farmerManage/edit',
    method: 'post',
    data,
  });
}

export function beeAccessImport(data) {
  return request({
    url: '/plan/bee/access/import',
    method: 'post',
    data,
  });
}

export function beeProtocolInfo(data) {
  return request({
    url: '/plan/bee/protocol/info',
    method: 'post',
    data,
  });
}

export function beeAccessDelete(data) {
  return request({
    url: 'plan/bee/access/delete',
    method: 'post',
    data,
  });
}

export function beeAccessEdit(data) {
  return request({
    url: 'plan/bee/access/edit',
    method: 'post',
    data,
  });
}

export function beeProtocolEdit(data) {
  return request({
    url: '/plan/bee/protocol/edit',
    method: 'post',
    data,
  });
}

export function beeMatchLists(data) {
  return request({
    url: '/plan/bee/match/list',
    method: 'post',
    data,
  });
}

export function beeMatchAudit(data) {
  return request({
    url: '/plan/bee/match/audit',
    method: 'post',
    data,
  });
}

export function beeMatchVillageAudit(data) {
  return request({
    url: '/plan/bee/match/villageAudit',
    method: 'post',
    data,
  });
}

export function beeMatchTownAudit(data) {
  return request({
    url: '/plan/bee/match/TownAudit',
    method: 'post',
    data,
  });
}

export function beeMatchAuditInfo(data) {
  return request({
    url: '/plan/bee/match/auditInfo',
    method: 'post',
    data,
  });
}

export function beeMatchInfo(data) {
  return request({
    url: '/plan/bee/match/info',
    method: 'post',
    data,
  });
}

export function beeMatchExport(data) {
  return requestBlob({
    url: '/plan/bee/match/export',
    method: 'post',
    responseType: 'blob',
    data,
  });
}

export function beeWorkLists(data) {
  return request({
    url: '/plan/bee/work/list',
    method: 'post',
    data,
  });
}

export function beeWorkExport(data) {
  return requestBlob({
    url: '/plan/bee/work/export',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function beeWorkDelete(data) {
  return request({
    url: '/plan/bee/work/delete',
    method: 'post',
    data,
  });
}

export function beeTrainLists(data) {
  return request({
    url: '/plan/bee/train/list',
    method: 'post',
    data,
  });
}

export function beeTrainExport(data) {
  return requestBlob({
    url: '/plan/bee/train/export',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function beeHiveLists(data) {
  return request({
    url: '/plan/bee/hive/list',
    method: 'post',
    data,
  });
}

export function beeTrainDelete(data) {
  return request({
    url: '/plan/bee/train/delete',
    method: 'post',
    data,
  });
}

export function beeTrainAdd(data) {
  return request({
    url: '/plan/bee/train/add',
    method: 'post',
    data,
  });
}

export function beeTrainEdit(data) {
  return request({
    url: '/plan/bee/train/edit',
    method: 'post',
    data,
  });
}

export function beeMajorList(data) {
  return request({
    url: '/plan/bee/major/list',
    method: 'post',
    data,
  });
}

export function beeMajorAudit(data) {
  return request({
    url: '/plan/bee/major/audit',
    method: 'post',
    data,
  });
}

export function beeMajoriInfo(data) {
  return request({
    url: '/plan/bee/major/info',
    method: 'post',
    data,
  });
}

export function beeFarmerList(data) {
  return request({
    url: '/plan/bee/farmer/list',
    method: 'post',
    data,
  });
}

export function beeFarmerAudit(data) {
  return request({
    url: '/plan/bee/farmer/audit',
    method: 'post',
    data,
  });
}

export function beeFarmerBatchAudit(data) {
  return request({
    url: '/plan/bee/farmer/batchAudit',
    method: 'post',
    data,
  });
}

export function beeFarmerInfo(data) {
  return request({
    url: '/plan/bee/farmer/info',
    method: 'post',
    data,
  });
}

export function beeMajorMatch(data) {
  return request({
    url: '/plan/bee/major/match',
    method: 'post',
    data,
  });
}

export function beeFarmerMatch(data) {
  return request({
    url: '/plan/bee/farmer/match',
    method: 'post',
    data,
  });
}

export function beeTrainAuditList(data) {
  return request({
    url: '/plan/bee/train/auditList',
    method: 'post',
    data,
  });
}

export function beeTrainAudit(data) {
  return request({
    url: '/plan/bee/train/audit',
    method: 'post',
    data,
  });
}

export function beeWorkAuditList(data) {
  return request({
    url: '/plan/bee/work/auditList',
    method: 'post',
    data,
  });
}

export function beeWorkAudit(data) {
  return request({
    url: '/plan/bee/work/audit',
    method: 'post',
    data,
  });
}

export function beeProfitAuditList(data) {
  return request({
    url: '/plan/bee/profit/auditList',
    method: 'post',
    data,
  });
}

export function beeProfitAuditInfo(data) {
  return request({
    url: '/plan/bee/profit/auditInfo',
    method: 'post',
    data,
  });
}

export function beeProfitAudit(data) {
  return request({
    url: '/plan/bee/profit/audit',
    method: 'post',
    data,
  });
}
export function beeProfitAuditExport(data) {
  return requestBlob({
    url: '/plan/bee/profit/auditExport',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function beeFarmerDropList(data) {
  return request({
    url: '/plan/bee/farmer/dropList',
    method: 'post',
    data,
  });
}

export function beeFarmerDropAuditExport(data) {
  return requestBlob({
    url: '/plan/bee/farmer/dropAuditExport',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function beeFarmerDropAudit(data) {
  return request({
    url: '/plan/bee/farmer/dropAudit',
    method: 'post',
    data,
  });
}

export function beeMatchAuditList(data) {
  return request({
    url: '/plan/bee/match/auditList',
    method: 'post',
    data,
  });
}

export function beeMajorAuditList(data) {
  return request({
    url: '/plan/bee/major/auditList',
    method: 'post',
    data,
  });
}
export function beeMajorAuditInfo(data) {
  return request({
    url: '/plan/bee/major/auditInfo',
    method: 'post',
    data,
  });
}

export function beeFarmerAuditList(data) {
  return request({
    url: '/plan/bee/farmer/auditList',
    method: 'post',
    data,
  });
}

export function beeFarmerApplyList(data) {
  return request({
    url: '/plan/bee/farmerApply/list',
    method: 'post',
    data,
  });
}

export function beeFarmerApplyApply(data) {
  return request({
    url: '/plan/bee/farmerApply/apply',
    method: 'post',
    data,
  });
}

export function beeFarmerApplyExport(data) {
  return requestBlob({
    url: '/plan/bee/farmerApply/export',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function beeMatchAuditExport(data) {
  return requestBlob({
    url: '/plan/bee/match/auditExport',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function beeFarmerAuditExport(data) {
  return requestBlob({
    url: '/plan/bee/farmer/auditExport',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function beeMajorAuditExport(data) {
  return requestBlob({
    url: '/plan/bee/major/auditExport',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function beeFarmerAssistList(data) {
  return request({
    url: '/plan/bee/farmerAssist/list',
    method: 'post',
    data,
  });
}

export function beeFarmerAssistInfo(data) {
  return request({
    url: '/plan/bee/farmerAssist/info',
    method: 'post',
    data,
  });
}

export function beeFarmerAssistExport(data) {
  return requestBlob({
    url: '/plan/bee/farmerAssist/export',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function beeFarmerAssistMatch(data) {
  return request({
    url: '/plan/bee/farmerAssist/match',
    method: 'post',
    data,
  });
}

export function beeFarmerAssistMajorList(data) {
  return request({
    url: '/plan/bee/farmerAssist/majorList',
    method: 'post',
    data,
  });
}

export function majorDropList(data) {
  return request({
    url: '/plan/bee/majorDrop/list',
    method: 'post',
    data,
  });
}

export function majorDropInfo(data) {
  return request({
    url: '/plan/bee/majorDrop/info',
    method: 'post',
    data,
  });
}

export function majorDropAudit(data) {
  return request({
    url: '/plan/bee/majorDrop/audit',
    method: 'post',
    data,
  });
}

export function applyPolicyList(data) {
  return request({
    url: '/apply/policy/list',
    method: 'post',
    data,
  });
}

export function addPolicy(data) {
  return request({
    url: '/apply/policy/add',
    method: 'post',
    data,
  });
}

export function editPolicy(data) {
  return request({
    url: '/apply/policy/edit',
    method: 'post',
    data,
  });
}

export function policyInfo(data) {
  return request({
    url: '/apply/policy/info',
    method: 'post',
    data,
  });
}

export function deletePolicy(data) {
  return request({
    url: '/apply/policy/delete',
    method: 'post',
    data,
  });
}

export function topPolicy(data) {
  return request({
    url: '/apply/policy/top',
    method: 'post',
    data,
  });
}

export function applyList(data) {
  return request({
    url: '/apply/list',
    method: 'post',
    data,
  });
}

export function planBeeWorkFarmerList(data) {
  return request({
    url: '/plan/bee/work/farmerList',
    method: 'post',
    data,
  });
}
export function planBeeWorkBatchApply(data) {
  return request({
    url: '/plan/bee/work/batchApply',
    method: 'post',
    data,
  });
}

export function planBeeTrainFarmerList(data) {
  return request({
    url: '/plan/bee/train/farmerList',
    method: 'post',
    data,
  });
}
export function planBeeTrainBatchApply(data) {
  return request({
    url: '/plan/bee/train/batchApply',
    method: 'post',
    data,
  });
}
export function planBeeFarmerApplyBatchApply(data) {
  return request({
    url: '/plan/bee/farmerApply/batchApply',
    method: 'post',
    data,
  });
}

export function industrySeedLists(data) {
  return request({
    url: '/industry/seed/lists',
    method: 'post',
    data,
  });
}

export function industrySeedAdd(data) {
  return request({
    url: '/industry/seed/add',
    method: 'post',
    data,
  });
}

export function industrySeedEdit(data) {
  return request({
    url: '/industry/seed/edit',
    method: 'post',
    data,
  });
}

export function industrySeedExport(data) {
  return requestBlob({
    url: '/industry/seed/export',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function industrySeedInfo(data) {
  return request({
    url: '/industry/seed/info',
    method: 'post',
    data,
  });
}

export function industrySeedDisplay(data) {
  return request({
    url: '/industry/seed/display',
    method: 'post',
    data,
  });
}

export function industrySeedHidden(data) {
  return request({
    url: '/industry/seed/hidden',
    method: 'post',
    data,
  });
}

export function industrySeedApplyLists(data) {
  return request({
    url: '/industry/seedApply/lists',
    method: 'post',
    data,
  });
}

export function industrySeedApplyExport(data) {
  return requestBlob({
    url: '/industry/seedApply/export',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function industrySeedApplyCancel(data) {
  return request({
    url: '/industry/seedApply/cancel',
    method: 'post',
    data,
  });
}
export function industrySeedApplySettle(data) {
  return request({
    url: '/industry/seedApply/settle',
    method: 'post',
    data,
  });
}

export function industrySeedApplyInfo(data) {
  return request({
    url: '/industry/seedApply/info',
    method: 'post',
    data,
  });
}

export function industryFarLists(data) {
  return request({
    url: '/industry/far/lists',
    method: 'post',
    data,
  });
}
export function industryFarAudit(data) {
  return request({
    url: '/industry/far/audit',
    method: 'post',
    data,
  });
}
export function industryFarInfo(data) {
  return request({
    url: '/industry/far/info',
    method: 'post',
    data,
  });
}
export function industryFarExport(data) {
  return requestBlob({
    url: '/industry/far/export',
    method: 'get',
    responseType: 'blob',
    data,
  });
}
export function industryFarEdit(data) {
  return request({
    url: '/industry/far/edit',
    method: 'post',
    data,
  });
}

export function industryErpLists(data) {
  return request({
    url: '/industry/erp/lists',
    method: 'post',
    data,
  });
}

export function industryErpAudit(data) {
  return request({
    url: '/industry/erp/audit',
    method: 'post',
    data,
  });
}

export function industryErpExport(data) {
  return requestBlob({
    url: '/industry/erp/export',
    method: 'get',
    responseType: 'blob',
    data,
  });
}

export function industryErpInfo(data) {
  return request({
    url: '/industry/erp/info',
    method: 'post',
    data,
  });
}

export function industryErpEdit(data) {
  return request({
    url: '/industry/erp/edit',
    method: 'post',
    data,
  });
}

export function industryplantLists(data) {
  return request({
    url: '/industry/plant/lists',
    method: 'post',
    data,
  });
}

export function industryplantInfo(data) {
  return request({
    url: '/industry/plant/info',
    method: 'post',
    data,
  });
}

export function industryplantAdd(data) {
  return request({
    url: '/industry/plant/add',
    method: 'post',
    data,
  });
}

export function industryplantEdit(data) {
  return request({
    url: '/industry/plant/edit',
    method: 'post',
    data,
  });
}

export function industryplantApplyLists(data) {
  return request({
    url: '/industry/plant/applyList',
    method: 'post',
    data,
  });
}

export function industryplantApplyAudit(data) {
  return request({
    url: '/industry/plant/applyAudit',
    method: 'post',
    data,
  });
}

export function industryProcessLists(data) {
  return request({
    url: '/industry/plantProcess/lists',
    method: 'post',
    data,
  });
}
export function industryplantProcessExport(data) {
  return requestBlob({
    url: '/industry/plantProcess/export',
    method: 'get',
    responseType: 'blob',
    data,
  });
}
export function industryplantProcessAudit(data) {
  return request({
    url: '/industry/plantProcess/audit',
    method: 'post',
    data,
  });
}

export function industryplantApplyExport(data) {
  return requestBlob({
    url: '/industry/plant/applyExport',
    method: 'get',
    responseType: 'blob',
    data,
  });
}
