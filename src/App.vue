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
    return {
      common: {
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

        // borderRadius: '6px',
      },
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
        boxShadowFocus: 'none', // 去掉 focus 阴影（点击时）
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
