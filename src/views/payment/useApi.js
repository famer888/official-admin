import { Alova } from '@/utils/http/alova/index' 

export const getRechargeOrderPage = (data) => {
    return Alova.Post('/admin-api/ad-payment-server/pay/getRechargeOrderPage', data)
}