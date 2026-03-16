<template>
  <NConfigProvider
    v-if="!isLock"
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
  >
    <AppProvider>
      <RouterView />
    </AppProvider>
  </NConfigProvider>

  <transition v-if="isLock && $route.name !== 'login'" name="slide-up">
    <LockScreen />
  </transition>
</template>

<script lang="ts" setup>
  import { computed, onMounted, onUnmounted } from 'vue'
  import { zhCN, dateZhCN, darkTheme } from 'naive-ui'
  import { LockScreen } from '@/components/Lockscreen'
  import { AppProvider } from '@/components/Application'
  import { useScreenLockStore } from '@/store/modules/screenLock.js'
  import { useRoute } from 'vue-router'
  import { useDesignSettingStore } from '@/store/modules/designSetting'
  import { lighten } from '@/utils/index'

  const route = useRoute()
  const useScreenLock = useScreenLockStore()
  const designStore = useDesignSettingStore()
  const isLock = computed(() => useScreenLock.isLocked)
  const lockTime = computed(() => useScreenLock.lockTime)

  /**
   * @type import('naive-ui').GlobalThemeOverrides
   */
  const getThemeOverrides = computed(() => {
    const appTheme = designStore.appTheme
    const lightenStr = lighten(designStore.appTheme, 6)
    const common: Record<string, unknown> = {
      primaryColor: appTheme,
      primaryColorHover: lightenStr,
      primaryColorPressed: lightenStr,
      primaryColorSuppl: appTheme,

      infoColor: appTheme,
      infoColorHover: lightenStr,
      infoColorPressed: lightenStr,
      infoColorSuppl: appTheme,

      successColor: '#00b42a',
      successColorHover: '#73d13d',
      successColorPressed: '#389e0d',
      successColorSuppl: '#95de64',

      warningColor: '#faad14',
      warningColorHover: '#ffc53d',
      warningColorPressed: '#d48806',
      warningColorSuppl: '#ffd666',

      errorColor: '#f53f3f',
      errorColorHover: '#ff4d4f',
      errorColorPressed: '#cf1322',
      errorColorSuppl: '#ff7875',
    }

    // 亮色系下覆盖默认字体颜色
    if (!designStore.darkTheme) {
      common.textColor1 = '#455980' // 主文字（最深）
      // common.textColor2 = '#000000' // 次要文字
      // common.textColor3 = '#000000' // 辅助/
      common.primaryColor = '#3A82F9'
      common.primaryColorHover = '#3A82F9'
      common.primaryColorPressed = '#3A82F9'
      common.primaryColorSuppl = '#3A82F9'
    }

    return {
      common,
      Tag: {
        borderRadius: '4px',
      },
      LoadingBar: {
        colorLoading: appTheme,
      },
      Dialog: {
        borderRadius: '10px',
      },
      Input: {
        borderRadius: '4px',
        color: '#F4F5F9',
        colorFocus: '#F4F5F9',
        border: '0 solid transparent',
        borderHover: '0 solid transparent',
        borderFocus: '0 solid transparent',
        boxShadowFocus: 'none',
        placeholderColor: '#86909C',
        heightMedium: '42px',
      },
      Select: {
        peers: {
          InternalSelection: {
            borderRadius: '4px',
            boxShadowActive: 'none', // 去掉激活态阴影
            boxShadowFocus: 'none', // 去掉 focus 阴影（点击时）
          },
        },
      },
      Checkbox: {
        colorChecked: '#08caa2',
        colorCheckedHover: '#08caa2',
        colorCheckedPressed: '#08caa2',
        borderChecked: '1px solid #08caa2',
        borderFocus: '1px solid #08caa2',
      },
    }
  })

  const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined))

  let timer: NodeJS.Timer

  const timekeeping = () => {
    clearInterval(timer)
    if (route.name == 'login' || isLock.value) return
    // 设置不锁屏
    useScreenLock.setLock(false)
    // 重置锁屏时间
    useScreenLock.setLockTime()
    timer = setInterval(() => {
      // 锁屏倒计时递减
      useScreenLock.setLockTime(lockTime.value - 1)
      if (lockTime.value <= 0) {
        // 设置锁屏
        useScreenLock.setLock(true)
        return clearInterval(timer)
      }
    }, 1000)
  }

  onMounted(() => {
    // document.addEventListener('mousedown', timekeeping);
  })

  onUnmounted(() => {
    // document.removeEventListener('mousedown', timekeeping);
  })
</script>
