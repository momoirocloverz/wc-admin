import request from '@/utils/request'

function getFundingDataForOfficeOfBudget(searchKeyword, date, townName, villageName, pageNum, pageSize) {
  return request({
    url: '/fund/czj',
    method: 'post',
    data: {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      keyword: searchKeyword,
      town_name: townName, // name???0.0
      village_name: villageName,
      page: pageNum,
      page_size: pageSize
    }
  })
}

function getFundingDataForDepartmentOfHealth(searchKeyword, date, townName, villageName, pageNum, pageSize) {
  return request({
    url: '/fund/wjj',
    method: 'post',
    data: {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      keyword: searchKeyword,
      town_name: townName, // name???0.0
      village_name: villageName,
      page: pageNum,
      page_size: pageSize
    }
  })
}

export { getFundingDataForDepartmentOfHealth, getFundingDataForOfficeOfBudget }
