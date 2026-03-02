/**
 * @description: 请求结果集
 */
export enum ResultEnum {
  SUCCESS = 0,
  ERROR = -1,
  TIMEOUT = 10042,

  // ✅ 权限不足（已登录但没权限）
  FORBIDDEN = 403,
  // 非法token
  TOKEN_INVALID = 10,
  // ✅ 登录过期/被踢（后端自定义状态）
  TOKEN_EXPIRED = 11,
  // ✅ 登录失效（token过期/未登录）
  UNAUTHORIZED = 12,
  // ✅ 鉴权失败
  AUTH_FAILED = 401,
  // 未登录
  NOT_LOGIN = 6001,
  //过期
  EXPIRED = 6002,
  TYPE = 'success',
}

/**
 * @description: 请求方法
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  常用的contentTyp类型
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // json
  TEXT = 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  上传
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
