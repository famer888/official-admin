import {NTag} from 'naive-ui'

const orderStatus = {
    0: {
        type: 'warning',
        text: '待支付'
    },
    1: {
        type: 'success',
        text: '已支付'
    },
    2: {
        type: 'warning',
        text: '已取消'
    },
}

export const getColumns = () => {
    return [
        {
            title: 'ID',
            key: 'id',
            width: '200px',
            align: 'center',
        },
        {
            title: '金额（USD）',
            key: 'payFee',
            width: '200px',
            align: 'center',
        },
        {
            title: '付款账号',
            key: 'userName',
            width: '200px',
            align: 'center',  
             
        },
        {
            title: '订单状态',
            key: 'orderState',
            width: '200px',
            align: 'center',  
            render(row) {
                const status = orderStatus[row.status]
                return status ? h(NTag, {type: status.type}, {
                    default: () => status.text
                }) : null
            }   
        },
        {
            title: '更新时间',
            key: 'updateTime',
            width: '200px',
            align: 'center',    
        },
    ]
}