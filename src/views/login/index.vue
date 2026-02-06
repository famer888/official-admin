<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-background">
      <div class="line line-1"></div>
      <div class="line line-2"></div>
      <div class="line line-3"></div>
      <div class="square square-1"></div>
      <div class="square square-2"></div>
      <div class="triangle"></div>
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
    </div>
    <div class="view-account-container animate__animated animate__fadeInDown">
      <div class="view-account-top">
        <!-- <div class="view-account-top-logo">
          <img :src="websiteConfig.loginImage" alt="" />
        </div> -->
        <h1 class="view-account-top-desc font-bold text-2xl text-black mb-4">{{
          websiteConfig.loginDesc
        }}</h1>
      </div>
      <div class="view-account-form">
        <h2 class="view-account-title">账号登录</h2>
        <div class="login-welcome">欢迎回来，请登录您的账号</div>
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
          :rules="rules"
          class="login-form"
        >
          <n-form-item path="loginEmail" class="mb-2">
            <n-input
              v-model:value="formInline.loginEmail"
              placeholder="请输入用户名"
              class="login-input"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password" class="mb-2">
            <n-input
              v-model:value="formInline.password"
              type="password"
              showPasswordOn="click"
              placeholder="请输入密码"
              class="login-input"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="securityCode" class="mb-2">
            <n-input
              v-model:value="formInline.securityCode"
              showPasswordOn="click"
              placeholder="请输入Google验证码"
              class="login-input"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <GooglePlusOutlined />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item>
            <n-button
              type="primary"
              @click="handleSubmit"
              size="large"
              :loading="loading"
              block
              class="login-button"
            >
              登录
            </n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useUserStore } from '@/store/modules/user'
  import { useMessage } from 'naive-ui'
  import { ResultEnum } from '@/enums/httpEnum'
  import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'
  import { GooglePlusOutlined } from '@vicons/antd'
  import { PageEnum } from '@/enums/pageEnum'
  import { websiteConfig } from '@/config/website.config'

  // 添加页面加载动画效果
  onMounted(() => {
    // 聚焦用户名输入框
    setTimeout(() => {
      const usernameInput = document.querySelector('input[placeholder="请输入用户名"]')
      if (usernameInput) {
        ;(usernameInput as HTMLElement).focus()
      }
    }, 500)
  })
  interface FormState {
    loginEmail: string
    password: string
    // securityCode: string
  }

  const formRef = ref()
  const message = useMessage()
  const loading = ref(false)
  const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME

  const formInline = reactive({
    loginEmail: '',
    password: '',
    securityCode: '',
    isCaptcha: true,
  })

  const rules = {
    loginEmail: { required: true, message: '请输入用户名', trigger: 'blur' },
    password: { required: true, message: '请输入密码', trigger: 'blur' },
    // securityCode: { required: true, message: '请输入Google验证码', trigger: 'blur' },
  }

  const userStore = useUserStore()

  const router = useRouter()
  const route = useRoute()

  const handleSubmit = (e) => {
    e.preventDefault()
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const { loginEmail, password, securityCode } = formInline
        message.loading('登录中...')
        loading.value = true

        const params: FormState = {
          loginEmail,
          password,
          // securityCode,
        }

        try {
          const { code, message: msg } = await userStore.login(params)

          message.destroyAll()

          if (code == ResultEnum.SUCCESS) {
            const toPath = decodeURIComponent((route.query?.redirect || '/') as string)
            message.success('登录成功，即将进入系统')

            if (route.name === LOGIN_NAME) {
              // router.replace('/')
              router.push({
                path: toPath,
                query: { ...route.query, redirect: undefined },
              })
            } else {
              router.replace(toPath)
            }
          } else {
            message.info(msg || '登录失败')
          }
        } finally {
          loading.value = false
        }
      }
    })
  }
</script>

<style lang="less" scoped>
  .view-account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
    background: url(../../assets/images/bg.webp) no-repeat;
    background-size: cover;
    position: relative;

    &-container {
      padding: 32px 40px;
      max-width: 580px;
      min-width: 460px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      margin-top: 10vh;
      position: absolute;
      right: 10vw;
      top: 0;
      bottom: 0;
      margin: auto 0;
      height: fit-content;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.18);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        transform: translateY(-5px);
      }

      // 移除圆形装饰元素

      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
        100% {
          transform: translateY(0px);
        }
      }
    }

    &-title {
      text-align: center;
      font-size: 22px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 2px;
        background: linear-gradient(to right, #2d8cf0, #0081ff);
        border-radius: 2px;
      }
    }

    .login-welcome {
      text-align: center;
      font-size: 14px;
      color: #606266;
      margin-bottom: 30px;
      margin-top: 20px;
    }

    &-top {
      padding: 10px 0;
      text-align: center;

      &-logo {
        margin-bottom: 8px;
        display: flex;
        justify-content: center;

        img {
          height: 60px;
        }
      }

      &-desc {
        font-size: 14px;
        color: #606266;
      }
    }

    &-other {
      width: 100%;
      display: flex;
      align-items: center;
    }

    .default-color {
      color: #515a6e;

      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }

    .login-button {
      margin-top: 10px;
      height: 42px;
      font-size: 16px;
      border-radius: 4px;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
      }

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 5px;
        background: rgba(255, 255, 255, 0.5);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1, 1) translate(-50%);
        transform-origin: 50% 50%;
      }

      &:focus:not(:active)::after {
        animation: ripple 1s ease-out;
      }

      @keyframes ripple {
        0% {
          transform: scale(0, 0);
          opacity: 0.5;
        }
        20% {
          transform: scale(25, 25);
          opacity: 0.3;
        }
        100% {
          opacity: 0;
          transform: scale(40, 40);
        }
      }
    }

    .remember-forgot {
      margin-bottom: 5px;

      .flex-between-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .right {
        text-align: right;
      }
    }

    .forgot-link {
      color: #606266;
      transition: all 0.2s;

      &:hover {
        color: #2d8cf0;
      }
    }

    .social-login {
      display: flex;
      margin-left: 16px;
    }

    .social-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 12px;
      transition: all 0.3s;
      background-color: rgba(144, 147, 153, 0.1);

      &:hover {
        background-color: rgba(45, 140, 240, 0.2);
        transform: scale(1.1);

        :deep(svg) {
          color: #2d8cf0 !important;
        }
      }
    }

    .register-link {
      color: #2d8cf0;
      transition: all 0.3s;

      &:hover {
        color: #57a3f3;
        text-decoration: underline;
      }
    }

    .login-form {
      :deep(.n-form-item-feedback-wrapper) {
        min-height: 18px;
      }

      :deep(.n-input) {
        border-radius: 4px;
      }

      padding: 0;
    }

    .login-input {
      :deep(.n-input__input-el) {
        padding-left: 5px;
      }

      :deep(.n-input-wrapper) {
        transition: all 0.3s ease;
      }

      &:hover {
        :deep(.n-input-wrapper) {
          box-shadow: 0 0 0 1px rgba(45, 140, 240, 0.2);
        }
      }
    }

    .username-item,
    .password-item {
      margin-bottom: 24px;
    }

    .other-text {
      padding-left: 5px;
    }

    .other-item {
      margin-bottom: 0;
    }
  }
</style>
