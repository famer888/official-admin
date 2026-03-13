const toString = Object.prototype.toString

/**
 * @description: 判断值是否未某个类型
 */
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

/**
 * @description:  是否为函数
 */
export function isFunction<T = Function>(val: unknown): val is T {
  return is(val, 'Function') || is(val, 'AsyncFunction')
}

/**
 * @description: 是否已定义
 */
export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== 'undefined'
}

export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val)
}
/**
 * @description: 是否为对象
 */
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object')
}

/**
 * @description:  是否为时间
 */
export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

/**
 * @description:  是否为数值
 */
export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

/**
 * @description:  是否为AsyncFunction
 */
export function isAsyncFunction<T = any>(val: unknown): val is () => Promise<T> {
  return is(val, 'AsyncFunction')
}

/**
 * @description:  是否为promise
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/**
 * @description:  是否为字符串
 */
export function isString(val: unknown): val is string {
  return is(val, 'String')
}

/**
 * @description:  是否为boolean类型
 */
export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

/**
 * @description:  是否为数组
 */
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

/**
 * @description: 是否客户端
 */
export const isClient = () => {
  return typeof window !== 'undefined'
}

/**
 * @description: 是否为浏览器
 */
export const isWindow = (val: any): val is Window => {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!val.tagName
}

export const isServer = typeof window === 'undefined'

// 是否为图片节点
export function isImageDom(o: Element) {
  return o && ['IMAGE', 'IMG'].includes(o.tagName)
}

export function isNull(val: unknown): val is null {
  return val === null
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

//密码规则
const PASSWORD_ALLOWED_REGEX = /^[A-Za-z0-9~`!@#$%^&*()_\-+={[}\]|\\:;"'<>,.?/]+$/

/**
 * 密码规则：
 * 1) 8-20 位
 * 2) 必须同时包含字母和数字
 * 3) 仅支持字母、数字和特殊符号（不支持空格/中文）
 * 返回值：通过返回空字符串，不通过返回错误文案
 */
export function getPasswordRuleError(value: unknown): string {
  const password = String(value || '')

  if (password.length < 8 || password.length > 20) {
    return '密码长度必须在8-20位之间'
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return '密码需8-20位字母和数字'
  }
  if (!PASSWORD_ALLOWED_REGEX.test(password)) {
    return '密码仅支持字母、数字及特殊符号'
  }
  return ''
}
