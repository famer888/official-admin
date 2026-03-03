import {NButton, NTag, useDialog, useModal} from 'naive-ui'
  import usdtDefaultUrl from '@/assets/images/usdt-1.svg'
  import usdtActiveUrl from '@/assets/images/usdt-2.svg'
  import visaUrl from '@/assets/images/visa.svg'
  import bitcoinUrl from '@/assets/images/bitcoin.svg'
  import UploadPayScreenshot from './components/UploadPayScreenshot.vue'
import PreviewImage from './components/PreviewImage.vue'


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

export const getColumns = (reload) => {
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
                const status = orderStatus[row.orderState]
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
        {
            title: '操作',
            key: 'action',
            width: '200px',
            align: 'center',
            render(row) {
                const dialog = useDialog()

                return h(NButton,{
                    text: true,
                    type: 'primary',
                    onClick: () => {
                        dialog.create({
                            class: row.payVoucher ? 'preview-image-container' : 'upload-image-container',
                            showIcon: false,
                            closable: !row.payVoucher,
                            title: row.payVoucher ? '' : () => h('div', {class: `w-full text-center`}, {default: () => '上传截图'}),
                            width: '400px',
                            content: () => row.payVoucher ?
                            h(PreviewImage, {imageUrl: row.payVoucher})
                            : h(UploadPayScreenshot, {
                                id: row.id,
                                url: row.payVoucher,
                                onCancel: () => {
                                    dialog.destroyAll()
                                    reload()
                                },
                            }),
                        })
                    }
                },{
                    default: () => row.payVoucher ? '查看图片' : '上传截图'
                })
            }
        }
    ]
}

export const getPayMethod = (methods) => (
    methods.map((item) => ({
        label: item.label,
        value: item.value,
        icon: {
            default: item.icon,
            active: item.icon,
        }
    })).map(item => {
        if(item.value === 0) {
            item.icon.active = usdtActiveUrl
            item.icon.default = usdtDefaultUrl
        }else if(item.value === 1) {
            item.icon.active = visaUrl
            item.icon.default = visaUrl
        }

        return {
            ...item
        }
    })
)

export const payAmountOptions = [
    {
        label: '200',
        value: 200,
    },
    {
        label: '300',
        value: 300,
    },
    {
        label: '500',
        value: 500,
    },
    {
        label: '1000',
        value: 1000,
    },
    {
        label: '1500',
        value: 1500,
    },
    {
        label: '大额充值',
        value: null,
    },
]