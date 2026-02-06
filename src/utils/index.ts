import { h, unref } from 'vue'
import type { App, Plugin, Component } from 'vue'
import { NIcon, NTag } from 'naive-ui'
import { PageEnum } from '@/enums/pageEnum'
import { isObject } from './is/index'
import { cloneDeep } from 'lodash-es'
/**
 * render 图标
 * */
export function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
/**
 * font 图标(Font class)
 * */
export function renderFontClassIcon(icon: string, iconName = 'iconfont') {
  return () => h('span', { class: [iconName, icon] })
}
/**
 * font 图标(Unicode)
 * */
export function renderUnicodeIcon(icon: string, iconName = 'iconfont') {
  return () => h('span', { class: [iconName], innerHTML: icon })
}
/**
 * font svg 图标
 * */
export function renderfontsvg(icon) {
  return () =>
    h(NIcon, null, {
      default: () =>
        h('svg', { class: `icon`, 'aria-hidden': 'true' }, h('use', { 'xlink:href': `#${icon}` })),
    })
}

/**
 * render new Tag
 * */
const newTagColors = { color: '#f90', textColor: '#fff', borderColor: '#f90' }
export function renderNew(type = 'warning', text = 'New', color: object = newTagColors) {
  return () =>
    h(
      NTag as any,
      {
        type,
        round: true,
        size: 'small',
        color,
      },
      { default: () => text }
    )
}

/**
 * 递归组装菜单格式
 */
export function generatorMenu(routerMap: Array<any>) {
  return filterRouter(routerMap).map((item) => {
    const isRoot = isRootRouter(item)
    const info = isRoot ? item.children[0] : item
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
      icon: isRoot ? item.meta?.icon : info.meta?.icon,
    }
    // 是否有子菜单，并递归处理
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = generatorMenu(info.children)
    }
    return currentMenu
  })
}

/**
 * 混合菜单
 * */
export function generatorMenuMix(routerMap: Array<any>, routerName: string, location: string) {
  const cloneRouterMap = cloneDeep(routerMap)
  const newRouter = filterRouter(cloneRouterMap)
  if (location === 'header') {
    const firstRouter: any[] = []
    newRouter.forEach((item) => {
      const isRoot = isRootRouter(item)
      const info = isRoot ? item.children[0] : item
      info.children = undefined
      const currentMenu = {
        ...info,
        ...info.meta,
        label: info.meta?.title,
        key: info.name,
      }
      firstRouter.push(currentMenu)
    })
    return firstRouter
  } else {
    return getChildrenRouter(newRouter.filter((item) => item.name === routerName))
  }
}

/**
 * 递归组装子菜单
 * */
export function getChildrenRouter(routerMap: Array<any>) {
  return filterRouter(routerMap).map((item) => {
    const isRoot = isRootRouter(item)
    const info = isRoot ? item.children[0] : item
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
    }
    // 是否有子菜单，并递归处理
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = getChildrenRouter(info.children)
    }
    return currentMenu
  })
}

/**
 * 判断根路由 Router
 * */
export function isRootRouter(item) {
  return (
    item.meta?.alwaysShow != true &&
    item?.children?.filter((item) => !Boolean(item?.meta?.hidden))?.length === 1
  )
}

/**
 * 排除Router
 * */
export function filterRouter(routerMap: Array<any>) {
  return routerMap.filter((item) => {
    return (
      (item.meta?.hidden || false) != true &&
      !['/:path(.*)*', '/', PageEnum.REDIRECT, PageEnum.BASE_LOGIN].includes(item.path)
    )
  })
}

export const withInstall = <T extends Component>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 *  找到对应的节点
 * */
let result = null
export function getTreeItem(data: any[], key?: string | number): any {
  data.map((item) => {
    if (item.key === key) {
      result = item
    } else {
      if (item.children && item.children.length) {
        getTreeItem(item.children, key)
      }
    }
  })
  return result
}

/**
 *  找到所有节点
 * */
const treeAll: any[] = []
export function getTreeAll(data: any[]): any[] {
  data.map((item) => {
    treeAll.push(item.key)
    if (item.children && item.children.length) {
      getTreeAll(item.children)
    }
  })
  return treeAll
}

// dynamic use hook props
export function getDynamicProps<T extends {}, U>(props: T): Partial<U> {
  const ret: Recordable = {}

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key])
  })

  return ret as Partial<U>
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
  }
  return src
}

/**
 * Sums the passed percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * Lightens a 6 char HEX color according to the passed percentage
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed color represented as HEX
 */
export function lighten(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`
}

/**
 * 判断是否 url
 * */
export function isUrl(url: string) {
  return /^(http|https):\/\//g.test(url)
}

/**
 * 通用树形结构转换函数
 * @param {Array} data - 原始树形数组
 * @param {Object} options - 字段映射配置
 * @param {string} options.idField - 原始 id 字段名
 * @param {string} options.nameField - 原始名称字段名
 * @param {string} options.childrenField - 原始 children 字段名
 * @param {string} options.keyField - 输出 key 字段名
 * @param {string} options.labelField - 输出 label 字段名
 * @returns {Array}
 */
export function transformTree(
  data = [],
  {
    idField = 'id',
    nameField = 'name',
    childrenField = 'children',
    keyField = 'key',
    labelField = 'label',
  } = {}
) {
  return data.map((item) => {
    const { children: child, ...rest } = item
    const node = {
      ...rest,
      [keyField]: item[idField],
      [labelField]: item[nameField],
    }
    const children = item[childrenField]
    if (Array.isArray(children) && children.length > 0) {
      node[childrenField] = transformTree(children, {
        idField,
        nameField,
        childrenField,
        keyField,
        labelField,
      })
    }
    return node
  })
}

/**
 * 通用高精度计算工具（解决 JS 浮点误差）
 * 支持：add / sub / mul / div
 */

function toInteger(num) {
  // 1️⃣ 基础防御：确保是可转数字的值
  const safeNum = Number(num)
  if (Number.isNaN(safeNum) || num === null || num === undefined) {
    return { intNum: 0, times: 1 }
  }

  // 2️⃣ 转字符串（安全）
  const strNum = safeNum.toString()

  // 3️⃣ 处理科学计数法（例如 1e-7）
  if (strNum.includes('e')) {
    const decimalLength = getDecimalLength(safeNum)
    const times = Math.pow(10, decimalLength)
    const intNum = Math.round(safeNum * times)
    return { intNum, times }
  }

  // 4️⃣ 正常小数处理
  const decimalLength = getDecimalLength(safeNum)
  const times = Math.pow(10, decimalLength)
  const intNum = Number(strNum.replace('.', ''))

  return { intNum, times }
}

function getDecimalLength(num) {
  try {
    const parts = num.toString().split('.')
    return parts[1] ? parts[1].length : 0
  } catch {
    return 0
  }
}

function operation(a, b, op) {
  const { intNum: n1, times: t1 } = toInteger(a)
  const { intNum: n2, times: t2 } = toInteger(b)

  const maxTimes = Math.max(t1, t2)

  switch (op) {
    case 'add':
      return (n1 * (maxTimes / t1) + n2 * (maxTimes / t2)) / maxTimes
    case 'sub':
      return (n1 * (maxTimes / t1) - n2 * (maxTimes / t2)) / maxTimes
    case 'mul':
      return (n1 * n2) / (t1 * t2)
    case 'div':
      return (n1 / n2) * (t2 / t1)
    default:
      throw new Error(`Unsupported operator: ${op}`)
  }
}

// 对外暴露的接口
export const mathPrecise = {
  add: (a, b) => operation(a, b, 'add'),
  sub: (a, b) => operation(a, b, 'sub'),
  mul: (a, b) => operation(a, b, 'mul'),
  div: (a, b) => operation(a, b, 'div'),
}
