  import usdtUrl from '@/assets/images/usdt.svg'
  import visaUrl from '@/assets/images/visa.svg'
  import bitcoinUrl from '@/assets/images/bitcoin.svg'

export const payMethod = [
    {
        label: 'USDT',
        value: 0,
        icon: usdtUrl
    },
    {
        label: '手动入账',
        value: 1,
        icon: visaUrl
    }
]

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
        value: 1,
    },
]