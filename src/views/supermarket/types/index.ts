export interface AdTypeData {
  id: string | number
  title?: string
  description?: string
  image?: string
  buttonType?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  buttonGhost?: boolean
  // 接口返回的字段
  displayScenario?: string
  advertiseDesc?: string
  exampleUrl?: string
  advertiseName?: string
  adMode?: string
  styleSizeDesc?: string
  fileFormat?: string
  estimatedExposure?: number
  optimalExposure?: number
  averageExposure?: number
  optimalClicks?: number
  averageClicks?: number
  trafficSourceChrome?: number
  trafficSourceIe?: number
  trafficSourceFirefox?: number
  trafficSourceSafari?: number
  trafficSource360safebrowser?: number
  trafficSourceSogouexplorer?: number
  trafficSourceYandexbrowser?: number
  trafficSourceSilk?: number
  trafficSourceOther?: number
  trafficCfgChinamainland?: number
  trafficCfgChinataiwan?: number
  trafficCfgSouthkorea?: number
  trafficCfgJapan?: number
  trafficCfgUnitedstates?: number
  trafficCfgOther?: number
  price7d?: number
  price14d?: number
  price30d?: number
  [key: string]: any
}

