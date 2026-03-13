// color
export const colorMap = {
  0: '#FF4D4F', // 失败 (红色)
  1: '#00b42a', // 成功 (绿色)
  2: '#FA8C16', // 警告 (橙色)
  3: '#1890FF', // 信息 (蓝色)
  4: '#2F54EB', // 主要操作 (深蓝)
  5: '#FFB800', // 提示 (金黄色)
  6: '#8C8C8C', // 默认 (灰色)
  7: '#13C2C2', // 成功提示 (青色)
  8: '#FFC107', // 警告提示 (明黄色)
  9: '#F5222D', // 错误提示 (红色)
  10: '#B37FEB', // 额外操作 (紫色)
}

// 启用禁用状态
export const statusMap = {
  1: { label: '启用', type: 'success' },
  0: { label: '禁用', type: 'error' },
}

export const statusOptions = [
  { value: 1, label: '启用', type: 'success' },
  { value: 0, label: '禁用', type: 'error' },
]

//  付费类型
export const payOptions = [
  { value: 0, label: '全部', type: 'success' },
  { value: 1, label: '免费类型', type: 'error' },
  { value: 2, label: '付费类型', type: 'info' },
]

// 素材类型
export const materialTypeMap = {
  1: { label: '播放器', type: 'info' },
  2: { label: '药台', type: 'info' },
  3: { label: '炮台', type: 'info' },
  4: { label: '黄油', type: 'info' },
  5: { label: '直播', type: 'info' },
  6: { label: 'BC', type: 'info' },
}

export const materialTypeOptions = [
  { value: 1, label: '播放器', type: 'info' },
  { value: 2, label: '药台', type: 'info' },
  { value: 3, label: '炮台', type: 'info' },
  { value: 4, label: '黄油', type: 'info' },
  { value: 5, label: '直播', type: 'info' },
  { value: 6, label: 'BC', type: 'info' },
]

// 收款状态
export const collectionMap = {
  1: { label: '已付款', type: 'success' },
  0: { label: '未付款', type: 'error' },
}

export const collectionOptions = [
  { value: 1, label: '已付款', type: 'success' },
  { value: 0, label: '未付款', type: 'error' },
]

// 指定类型
export const typeMap = {
  0: 'paidType', // 付费类型
  1: 'locationType', // 广告位类型
  2: 'displayType', // 广告位展示模式
  3: 'appType', // 应用类型
  4: 'paidStatus', // 付费状态
  5: 'payStatus', // 收款状态
  6: 'clientType', // 客户类型
  7: 'adLocationStatus', // 广告位状态
  8: 'deviceType', //  设备/平台类型
  9: 'clientAttr', //  客户属性
  10: 'verification', // 收款记录核算状态
  11: 'adMaterialType', // 广告素材类型
  12: 'remainPosition', // 空余位置
  13: 'grade', // 职级范围
  14: 'customerLevel', // 客户等级
  15: 'teaPaidType', // 客户等级
  16: 'advertiseType', // 广告上下架状态
  17: 'materialType', // 广告素材类型
  18: 'jumpType', // 跳转类型
  19: 'businessDomain', // 业务域
  20: 'payType', // 支付方式
  21: 'websiteOrderStatus', // 订单状态
}

//应用类型
export const applicationType = [
  { value: 0, label: '全部' },
  { value: 1, label: '视频' },
  { value: 2, label: '漫画' },
  { value: 3, label: '动漫' },
  { value: 4, label: '小说' },
  { value: 5, label: '暗网' },
  { value: 6, label: '猎奇' },
  { value: 7, label: '男男' },
  { value: 8, label: '女女' },
  { value: 8, label: '哟哟' },
]

// 空余位置数量
export const numberPpositions = [
  { value: 0, label: '全部' },
  { value: 1, label: '有位置' },
  { value: 2, label: '无位置' },
]

// 展示模型
export const displayModel = [
  { value: 0, label: '全部' },
  { value: 1, label: '多个轮播' },
  { value: 2, label: '单体' },
  { value: 3, label: '三分屏' },
  { value: 4, label: '四分屏' },
]

// 核算状态 核算状态(0-未核算 1-已核算 2-异常)
export const checkStatus = [
  { value: '', label: '全部' },
  { value: 0, label: '未核算' },
  { value: 1, label: '已核算' },
  { value: 2, label: '异常' },
]
export const checkStatusMap = {
  0: { value: 0, label: '未核算', type: 'warning' },
  1: { value: 1, label: '已核算', type: 'success' },
  2: { value: 2, label: '异常', type: 'error' },
}
