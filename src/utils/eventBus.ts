// 全局事件总线封装
import mitt from 'mitt'

// 创建 mitt 实例
const emitter = mitt()

// 封装成 Vue3 插件（可选，方便全局使用）
export const EventBusPlugin = {
  install(app) {
    // 全局挂载 $bus，组件内可通过 this.$bus 访问（选项式 API）
    app.config.globalProperties.$bus = emitter
    // 提供 inject 接口（组合式 API）
    app.provide('$bus', emitter)
  },
}

// 导出 emitter 实例（直接导入使用）
export default emitter
