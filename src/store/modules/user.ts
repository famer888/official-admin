import { defineStore } from 'pinia'
import { store } from '@/store'
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '@/store/mutation-types'
import { ResultEnum } from '@/enums/httpEnum'
import { transformTree } from '@/utils'
import { getUserInfo as getUserInfoApi, login, logoutAuth, logout as out } from '@/api/system/user'
import { getAllOptions } from '@/api/common'
import { storage } from '@/utils/Storage'
import { encrypt } from '@/utils/rsa.js'
import { typeMap } from '@/constants'
import { getUserInfoByAuth } from '@/api/system/user'
export type UserInfoType = {
  // TODO: add your own data
  username: string
  email: string
  isCompelte: number
}

export interface IUserState {
  token: string
  username: string
  welcome: string
  avatar: string
  permissions: any[]
  info: UserInfoType
  merchantList: any[]
  menus: any[]
  productList: any[]
  listMap: any
  base: any
  showUrl: string
  movieUrl: string
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
    merchantList: [],
    menus: [],
    productList: [],
    listMap: {},
    base: null,
    showUrl: '',
    movieUrl: '',
  }),
  getters: {
    getToken(): string {
      return this.token
    },
    getAvatar(): string {
      return this.avatar
    },
    getNickname(): string {
      return this.username
    },
    getPermissions(): [any][] {
      return this.permissions
    },
    getUserInfo(): UserInfoType {
      return this.info
    },
    getBase(): string {
      return this.base
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setPermissions(permissions) {
      this.permissions = permissions
    },
    setUserInfo(info: UserInfoType) {
      this.info = info
    },
    setMerchantList(info) {
      this.merchantList = info
    },
    setMenus(info) {
      this.menus = info
    },
    setProductList(info) {
      this.productList = info
    },
    setListMap(info) {
      this.listMap = info
    },
    setBase(info) {
      this.base = info
    },
    setShowUrl(showUrl: string) {
      this.showUrl = showUrl
    },
    setMovieUrl(movieUrl: string) {
      this.movieUrl = movieUrl
    },
    // 登录
    async login(params: any) {
      const { loginEmail, password, securityCode } = params
      const response = await login({
        loginEmail: loginEmail,
        password: password,
        recaptchaToken: '123456',
      })

      const { data, code } = response
      if (code === ResultEnum.SUCCESS) {
        const ex = 7 * 24 * 60 * 60
        storage.set(ACCESS_TOKEN, data.token, ex)
        storage.set(IS_SCREENLOCKED, false)
        this.setToken(data.token)
      }

      return response
    },
    async getInfoByAuth() {
      // if (import.meta.env.DEV) {
      //   return
      // }
      // await getUserInfoByAuth()
      this.getInfo()
    },

    // 获取用户信息
    async getInfo() {
      const res = await getUserInfoApi()

      const { menus, merchantScopeList, permissions, productScopeList, user, showUrl, movieUrl } =
        res?.data ?? {}
      // this.setMenus(transformTree(menus))
      // const merchantData = merchantScopeList?.map((item) => ({
      //   ...item,
      //   value: item.merchantCode,
      //   label: item.merchantName,
      // }))
      // this.setMerchantList(merchantData)
      // const productList =
      //   productScopeList?.map((item) => ({
      //     ...item,
      //     key: item.merchantCode,
      //     label: item.merchantName,
      //     ...(item?.productScopeList?.length
      //       ? {
      //           children: item.productScopeList?.map((p) => ({
      //             ...p,
      //             key: p.appCode,
      //             label: p.appName,
      //           })),
      //         }
      //       : {}),
      //   })) ?? []
      // this.setProductList(productList)
      // this.setPermissions(permissions)
      this.setUserInfo(user)
      this.setAvatar(user?.avatar)
      this.setBase(showUrl)
      this.setShowUrl(showUrl)
      this.setMovieUrl(movieUrl)
      return res
    },

    // 获取所有下拉选项
    async useAllOptions() {
      const response = await getAllOptions(Object.values(typeMap))
      const { data, code } = response
      if (code === ResultEnum.SUCCESS) {
        this.setListMap(data)
      }
    },
    // 登出
    async logout() {
      try {
        const res = await logoutAuth()
        if (res) {
          $message.success('成功退出登录')
          this.setPermissions([])
          this.setUserInfo({ username: '', email: '' })
          storage.remove(ACCESS_TOKEN)
          storage.remove(CURRENT_USER)
          await this.getInfoByAuth()
        }
      } catch (error) {}
    },
  },
})

// Need to be used outside the setup
export function useUser() {
  const userStore = useUserStore(store)
  // 设置全局引用，供 useGlobSetting 使用，避免循环依赖
  if (typeof window !== 'undefined') {
    ;(window as any).__userStore = userStore
  }
  return userStore
}
