<template>
  <div class="layout-header">
    <!--顶部菜单-->
    <div
      class="layout-header-left"
      v-if="navMode === 'horizontal' || (navMode === 'horizontal-mix' && mixMenu)"
    >
      <div class="logo" v-if="navMode === 'horizontal'">
        <img :src="websiteConfig.logo" alt="" />
        <h2 v-show="!collapsed" class="title">{{ websiteConfig.title }}</h2>
      </div>
      <AsideMenu
        :collapsed="collapsed"
        v-model:location="getMenuLocation"
        :inverted="getInverted"
        mode="horizontal"
      />
    </div>
    <!--左侧菜单-->
    <div class="layout-header-left" v-else>
      <!-- 菜单收起 -->
      <!-- <div
        class="ml-1 layout-header-trigger layout-header-trigger-min"
        @click="handleMenuCollapsed"
      >
        <n-icon size="18" v-if="collapsed">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon size="18" v-else>
          <MenuFoldOutlined />
        </n-icon>
      </div> -->
      <!-- 刷新 -->
      <div
        class="mr-1 layout-header-trigger layout-header-trigger-min"
        v-if="headerSetting.isReload"
        @click="reloadPage"
      >
        <n-icon size="18">
          <ReloadOutlined />
        </n-icon>
      </div>
      <!-- 面包屑 -->
      <n-breadcrumb v-if="crumbsSetting.show">
        <template
          v-for="routeItem in breadcrumbList"
          :key="routeItem.name === RedirectName ? void 0 : routeItem.name"
        >
          <n-breadcrumb-item v-if="routeItem.meta.title">
            <n-dropdown
              v-if="routeItem.children.length"
              :options="routeItem.children"
              @select="dropdownSelect"
            >
              <span class="link-text">
                <component
                  v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                  :is="routeItem.meta.icon"
                />
                {{ routeItem.meta.title }}
              </span>
            </n-dropdown>
            <span class="link-text" v-else>
              <component
                v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                :is="routeItem.meta.icon"
              />
              {{ routeItem.meta.title }}
            </span>
          </n-breadcrumb-item>
        </template>
      </n-breadcrumb>
    </div>
    <div class="layout-header-right">
      <div
        class="layout-header-trigger layout-header-trigger-min"
        v-for="item in iconList"
        :key="item.icon"
      >
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="item.icon" v-on="item.eventObject || {}" />
            </n-icon>
          </template>
          <span>{{ item.tips }}</span>
        </n-tooltip>
      </div>
      <!--切换全屏-->
      <!-- <div class="layout-header-trigger layout-header-trigger-min">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="fullscreenIcon" @click="toggleFullScreen" />
            </n-icon>
          </template>
          <span>全屏</span>
        </n-tooltip>
      </div> -->
      <!-- 新功能区域 -->
      <div class="header-features">
        <!-- 站内消息 -->
        <div class="header-feature-item" @click="handleMessageClick">
          <div class="feature-icon-wrapper">
            <img :src="layout1Icon" alt="站内消息" class="feature-icon-img" />
            <n-badge :value="messageCount" :max="99" class="feature-badge" />
          </div>
          <span class="feature-text feature-text-message">站内消息</span>
        </div>
        <div class="feature-divider"></div>
        <!-- USD余额 -->
        <div class="header-feature-item">
          <div class="feature-icon-wrapper">
            <img :src="layout2Icon" alt="USD余额" class="feature-icon-img" />
          </div>
          <span class="feature-text feature-text-red">USD:{{ usdBalance }}</span>
        </div>
        <div class="feature-divider"></div>
        <!-- 用户ID -->
        <div class="header-feature-item">
          <div class="feature-icon-wrapper">
            <img :src="layout3Icon" alt="用户ID" class="feature-icon-img" />
          </div>
          <span class="feature-text feature-text-blue">ID:{{ userId }}</span>
        </div>
        <div class="feature-divider"></div>
        <!-- 常见问题 -->
        <div class="header-feature-item" @click="handleFaqClick">
          <div class="feature-icon-wrapper">
            <img :src="layout4Icon" alt="常见问题" class="feature-icon-img" />
          </div>
          <span class="feature-text feature-text-blue">常见问题</span>
        </div>
        <div class="feature-divider"></div>
        <!-- 登出 -->
        <div class="header-feature-item" @click="doLogout">
          <div class="feature-icon-wrapper">
            <img :src="layout5Icon" alt="登出" class="feature-icon-img" />
          </div>
          <span class="feature-text feature-text-blue">登出</span>
        </div>
      </div>
      <!-- 个人中心 -->
      <!-- <div class="layout-header-trigger layout-header-trigger-min">
        <n-dropdown trigger="hover" @select="avatarSelect" :options="avatarOptions">
          <div class="avatar">
            <n-avatar round color="#165dFF" class="mr-2">
              {{ username.charAt(0).toUpperCase() }}
            </n-avatar>
            <div class="flex flex-col">
              <span>{{ username }}</span>
            </div>
          </div>
        </n-dropdown>
      </div> -->
      <!--设置-->
      <!-- <div class="layout-header-trigger layout-header-trigger-min" @click="openSetting">
        <n-tooltip placement="bottom-end">
          <template #trigger>
            <n-icon size="18" style="font-weight: bold">
              <SettingOutlined />
            </n-icon>
          </template>
          <span>项目配置</span>
        </n-tooltip>
      </div> -->
    </div>
  </div>
  <!--项目配置-->
  <ProjectSetting ref="drawerSetting" />
</template>

<script lang="ts">
  import { websiteConfig } from '@/config/website.config'
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting'
  import { AsideMenu } from '@/layout/components/Menu'
  import { RedirectName } from '@/router/constant'
  import { useScreenLockStore } from '@/store/modules/screenLock'
  import { useUserStore } from '@/store/modules/user'
  import { TABS_ROUTES } from '@/store/mutation-types'
  import { NDialogProvider, useDialog, useMessage } from 'naive-ui'
  import { computed, defineComponent, reactive, ref, toRefs, unref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import components from './components'
  import ProjectSetting from './ProjectSetting.vue'
  import layout1Icon from '@/assets/images/layout/layout1.svg'
  import layout2Icon from '@/assets/images/layout/layout2.svg'
  import layout3Icon from '@/assets/images/layout/layout3.svg'
  import layout4Icon from '@/assets/images/layout/layout4.svg'
  import layout5Icon from '@/assets/images/layout/layout5.svg'

  export default defineComponent({
    name: 'PageHeader',
    components: { ...components, NDialogProvider, ProjectSetting, AsideMenu },
    props: {
      collapsed: {
        type: Boolean,
      },
      inverted: {
        type: Boolean,
      },
    },
    emits: ['update:collapsed'],
    setup(props, { emit }) {
      const userStore = useUserStore()
      const useLockscreen = useScreenLockStore()
      const message = useMessage()
      const dialog = useDialog()
      const { navMode, navTheme, headerSetting, menuSetting, crumbsSetting } = useProjectSetting()

      const drawerSetting = ref()

      const state = reactive({
        username: userStore?.info?.username ?? '',
        fullscreenIcon: 'FullscreenOutlined',
        navMode,
        navTheme,
        headerSetting,
        crumbsSetting,
        messageCount: 99,
        usdBalance: '234.23',
        userId: (userStore?.info as any)?.id ?? '',
      })

      const getInverted = computed(() => {
        return ['light', 'header-dark'].includes(unref(navTheme)) ? props.inverted : !props.inverted
      })

      const mixMenu = computed(() => {
        return unref(menuSetting).mixMenu
      })

      const getChangeStyle = computed(() => {
        const { collapsed } = props
        const { minMenuWidth, menuWidth } = unref(menuSetting)
        return {
          left: collapsed ? `${minMenuWidth}px` : `${menuWidth}px`,
          width: `calc(100% - ${collapsed ? `${minMenuWidth}px` : `${menuWidth}px`})`,
        }
      })

      const getMenuLocation = computed(() => {
        return 'header'
      })

      const router = useRouter()
      const route = useRoute()

      const generator: any = (routerMap) => {
        return routerMap.map((item) => {
          const currentMenu = {
            ...item,
            label: item.meta.title,
            key: item.name,
            disabled: item.path === '/',
            hidden: item.meta.hidden,
          }

          // 是否有子菜单，并递归处理
          if (item.children && item.children.length > 0) {
            // Recursion
            currentMenu.children = generator(item.children, currentMenu)
          }

          return currentMenu
        })
      }

      const breadcrumbList = computed(() => {
        return generator(route.matched)
      })

      const dropdownSelect = (key) => {
        router.push({ name: key })
      }

      // 刷新页面
      const reloadPage = () => {
        router.push({
          path: '/redirect' + unref(route).fullPath,
        })
      }

      // 退出登录
      const doLogout = () => {
        dialog.info({
          title: '提示',
          content: '您确定要退出登录吗',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            userStore.logout().then(() => {
              // 移除标签页
              localStorage.removeItem(TABS_ROUTES)
              // router
              //   .replace({
              //     name: 'Login',
              //     query: {
              //       redirect: route.fullPath,
              //     },
              //   })
              //   .finally(() => location.reload())
            })
          },
          onNegativeClick: () => {},
        })
      }

      // 切换全屏图标
      const toggleFullscreenIcon = () =>
        (state.fullscreenIcon =
          document.fullscreenElement !== null ? 'FullscreenExitOutlined' : 'FullscreenOutlined')

      // 监听全屏切换事件
      document.addEventListener('fullscreenchange', toggleFullscreenIcon)

      // 全屏切换
      const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen()
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          }
        }
      }

      // 图标列表
      const iconList = [
        // {
        //   icon: 'SearchOutlined',
        //   tips: '搜索',
        // },
        // {
        //   icon: 'GithubOutlined',
        //   tips: 'github',
        //   eventObject: {
        //     click: () => window.open('https://github.com/jekip/naive-ui-admin'),
        //   },
        // },
        // {
        //   icon: 'LockOutlined',
        //   tips: '锁屏',
        //   eventObject: {
        //     click: () => useLockscreen.setLock(true),
        //   },
        // },
      ]
      const avatarOptions = [
        // {
        //   label: '个人设置',
        //   key: 1,
        // },
        {
          label: '退出登录',
          key: 2,
        },
      ]

      //头像下拉菜单
      const avatarSelect = (key) => {
        switch (key) {
          case 1:
            router.push({ name: 'Setting' })
            break
          case 2:
            doLogout()
            break
        }
      }

      function openSetting() {
        const { openDrawer } = drawerSetting.value
        openDrawer()
      }

      function handleMenuCollapsed() {
        emit('update:collapsed', !props.collapsed)
      }

      // 处理消息点击
      const handleMessageClick = () => {
        // TODO: 跳转到消息页面或打开消息弹窗
        message.info('站内消息功能')
      }

      // 处理常见问题点击
      const handleFaqClick = () => {
        // TODO: 跳转到常见问题页面或打开FAQ弹窗
        message.info('常见问题功能')
      }

      return {
        ...toRefs(state),
        iconList,
        toggleFullScreen,
        doLogout,
        route,
        dropdownSelect,
        avatarOptions,
        getChangeStyle,
        avatarSelect,
        breadcrumbList,
        reloadPage,
        drawerSetting,
        openSetting,
        getInverted,
        getMenuLocation,
        mixMenu,
        websiteConfig,
        handleMenuCollapsed,
        RedirectName,
        handleMessageClick,
        handleFaqClick,
        layout1Icon,
        layout2Icon,
        layout3Icon,
        layout4Icon,
        layout5Icon,
      }
    },
  })
</script>

<style lang="less" scoped>
  .layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    height: 64px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    transition: all 0.2s ease-in-out;
    width: 100%;
    z-index: 11;

    &-left {
      display: flex;
      align-items: center;

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64px;
        line-height: 64px;
        overflow: hidden;
        white-space: nowrap;
        padding-left: 10px;

        img {
          width: auto;
          height: 32px;
          margin-right: 10px;
        }

        .title {
          margin-bottom: 0;
        }
      }

      ::v-deep(.ant-breadcrumb span:last-child .link-text) {
        color: #515a6e;
      }

      .n-breadcrumb {
        display: inline-block;
      }

      &-menu {
        color: var(--text-color);
      }
    }

    &-right {
      display: flex;
      align-items: center;
      margin-right: 20px;

      .avatar {
        display: flex;
        align-items: center;
        height: 64px;
      }

      > * {
        cursor: pointer;
      }
    }

    &-trigger {
      display: inline-block;
      width: 64px;
      height: 64px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      .n-icon {
        display: flex;
        align-items: center;
        height: 64px;
        line-height: 64px;
      }

      &:hover {
        background: hsla(0, 0%, 100%, 0.08);
      }

      .anticon {
        font-size: 16px;
        color: #515a6e;
      }
    }

    &-trigger-min {
      width: auto;
      padding: 0 12px;
    }
  }

  .header-features {
    display: flex;
    align-items: center;
    height: 64px;
    margin: 0 8px;

    .header-feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      position: relative;

      &:hover {
        background: hsla(0, 0%, 100%, 0.08);
      }

      .feature-icon-wrapper {
        position: relative;
        width: 29px;
        height: 29px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 4px;

        .feature-icon-img {
          width: 29px;
          height: 29px;
          display: block;
        }

        .feature-badge {
          position: absolute;
          top: -4px;
          right: -4px;
        }
      }

      .feature-text {
        font-size: 12px;
        line-height: 1.2;
        white-space: nowrap;

        &.feature-text-message {
          color: #3a82f9;
        }

        &.feature-text-blue {
          color: #455980;
        }

        &.feature-text-red {
          color: #eb445a;
        }
      }
    }

    .feature-divider {
      width: 1px;
      height: 40px;
      background: #e8e8e8;
      margin: 0 4px;
    }
  }

  .layout-header-light {
    background: #fff;
    color: #515a6e;

    .n-icon {
      color: #515a6e;
    }

    .layout-header-left {
      ::v-deep(.n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link) {
        color: #515a6e;
      }
    }

    .layout-header-trigger {
      &:hover {
        background: #f8f8f9;
      }
    }

    .header-features {
      .header-feature-item {
        &:hover {
          background: #f8f8f9;
        }
      }
    }
  }

  .layout-header-fix {
    position: fixed;
    top: 0;
    right: 0;
    left: 200px;
    z-index: 11;
  }

  //::v-deep(.menu-router-link) {
  //  color: #515a6e;
  //
  //  &:hover {
  //    color: #1890ff;
  //  }
  //}

  ::v-deep(.n-avatar .n-avatar__text) {
    transform: translate(-50%, -50%);
  }
</style>
