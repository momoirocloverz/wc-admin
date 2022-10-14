import request from '@/utils/request'

// 原始用户类别：1低保救助（低保）；2低保边缘救助（低边）；3特困救助（五保）；4残疾人
function getGovEmployeePairingData(group, searchKeyword, townId, villageId, paired, pageNum, pageSize) {
  return request({
    url: '/user/jdgb',
    method: 'post',
    data: {
      type: 1,
      lb: group,
      keyword: searchKeyword,
      town_id: townId,
      village_id: villageId,
      is_sign: paired,
      page: pageNum,
      page_size: pageSize
    }
  })
}

function getDoctorPairingData(group, searchKeyword, townId, villageId, paired, pageNum, pageSize) {
  return request({
    url: '/user/qyys',
    method: 'post',
    data: {
      type: 2,
      lb: group,
      keyword: searchKeyword,
      town_id: townId,
      village_id: villageId,
      is_sign: paired,
      page: pageNum,
      page_size: pageSize
    }
  })
}

function getListOfTowns() {
  return request({
    url: '/public/town',
    method: 'post'
  })
}

function getListOfVillages(townId) {
  return request({
    url: '/public/village',
    method: 'post',
    data: {
      town_id: townId
    }
  })
}

function getVisitRecords(id, type, year) {
  return request({
    url: '/user/visit',
    method: 'post',
    data: {
      ID: id,
      type,
      year
    }
  })
}

function getIndividualProfile(id) {
  return request({
    url: '/user/info',
    method: 'post',
    data: {
      Card: id
    }
  })
}

function createPairing(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data
  })
}

export { getDoctorPairingData, getGovEmployeePairingData,
  getListOfTowns, getListOfVillages, getVisitRecords, getIndividualProfile, createPairing }
