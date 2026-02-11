import { Alova } from '@/utils/http/alova/index' 

// 获取订单列表
export const getRechargeOrderPage = (data) => {
    return Alova.Post('/admin-api/payment/pay/getRechargeOrderPage', data)
}

// 创建订单
export const createOrder = (data) => {
    return Alova.Post('/admin-api/payment/pay/createOrder', data)
}