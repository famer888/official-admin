// src/stores/eventStore.js
import { defineStore } from 'pinia'
import mitt from 'mitt'

// 1. 创建 mitt 实例（全局唯一，确保所有组件共用同一个事件总线）
const emitter = mitt()

// 2. 定义 Pinia Store，封装事件方法
export const useEventStore = defineStore('event', () => {
  /**
   * 发布事件（对应 emit）
   * @param {string} eventName 事件名称
   * @param {any} data 事件携带的数据
   */
  const emit = (eventName, data) => {
    emitter.emit(eventName, data)
  }

  /**
   * 订阅事件（对应 on）
   * @param {string} eventName 事件名称
   * @param {Function} handler 事件处理函数
   * @returns {Function} 取消订阅的函数（方便组件卸载时清理）
   */
  const on = (eventName, handler) => {
    emitter.on(eventName, handler)
    // 返回取消订阅函数，简化组件内的清理逻辑
    return () => emitter.off(eventName, handler)
  }

  /**
   * 取消指定事件的订阅（对应 off）
   * @param {string} eventName 事件名称
   * @param {Function} handler 事件处理函数（不传则取消该事件的所有订阅）
   */
  const off = (eventName, handler) => {
    emitter.off(eventName, handler)
  }

  /**
   * 清空所有事件订阅（谨慎使用）
   */
  const clearAll = () => {
    emitter.all.clear()
  }

  return { emit, on, off, clearAll }
})
