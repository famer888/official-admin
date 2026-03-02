import type { GlobConfig, LocalConfig } from '/#/config';

import { getAppEnvConfig } from '@/utils/env';
import { warn } from '@/utils/log';

// 延迟获取 user store，避免循环依赖
function getUserStoreSafely() {
  try {
    // 优先从全局引用获取，避免循环依赖
    if (typeof window !== 'undefined' && (window as any).__userStore) {
      return (window as any).__userStore;
    }
    // 如果全局引用不存在，尝试直接导入（可能会失败，但会使用环境变量作为后备）
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useUser } = require('@/store/modules/user');
    return useUser();
  } catch (error) {
    // 如果 store 还未初始化或导入失败，返回 null
    return null;
  }
}

// 这里的 useGlobSetting 用于获取全局配置，以下环境变量 带 VITE_GLOB_开头 会打包到 app.config 中去
export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_FILE_URL,
  } = getAppEnvConfig();

  if (!/[a-zA-Z\_]*/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    );
  }

  // 从 user store 获取 showUrl 和 movieUrl（完全依赖后端返回的数据）
  const userStore = getUserStoreSafely();

  // Take global configuration
  return {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    fileUrl: VITE_GLOB_FILE_URL,
    showUrl: userStore?.showUrl,
    movieUrl: userStore?.movieUrl,
  };
};

// 这里的 useLocalSetting 用于获取本地配置，以下环境变量不会打包到 app.config 中去
export const useLocalSetting = (): Readonly<LocalConfig> => {
  const { VITE_USE_MOCK, VITE_LOGGER_MOCK } = import.meta.env;

  function strToBoolean(val): boolean {
    return val === 'true';
  }
  return {
    useMock: strToBoolean(VITE_USE_MOCK),
    loggerMock: strToBoolean(VITE_LOGGER_MOCK),
  };
};
