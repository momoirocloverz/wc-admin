const ACTION_CONTEXT = Object.freeze({
  GOVERNMENT_EMPLOYEE: '干部',
  DOCTOR: '医生'
})

const GROUP_NAMES = Object.freeze([undefined, '低保救助', '低保边缘救助', '特困救助（五保）', '残疾人'])
const POVERTY_STATUS = Object.freeze([undefined, '未脱贫', '已脱贫', '注销'])
const VISIT_RECORD_TYPES = ([undefined, ACTION_CONTEXT.GOVERNMENT_EMPLOYEE, ACTION_CONTEXT.DOCTOR])
const PAYMENT_STATUS = Object.freeze({
  1: '支付成功'
})

export { ACTION_CONTEXT, GROUP_NAMES, POVERTY_STATUS, VISIT_RECORD_TYPES, PAYMENT_STATUS }
