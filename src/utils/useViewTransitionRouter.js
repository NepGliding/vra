import { useSupported, tryOnScopeDispose } from '@vueuse/core'
import { useRouter } from 'vue-router'

/**
 * 为 Vue Router 添加 View Transitions API 支持
 * @param {Router} router 可选，默认使用 useRouter()
 */
export function useViewTransitionRouter(router = useRouter()) {
  // 检测浏览器是否支持
  const isSupported = useSupported(() => document.startViewTransition)

  // 保存原始方法
  const originalPush = router.push
  const originalReplace = router.replace

  // 带过渡的导航函数
  const navigateWithTransition = async (to, options, replace = false) => {
    if (!isSupported.value) {
      // 不支持时直接跳转
      return replace
        ? originalReplace.call(router, to, options)
        : originalPush.call(router, to, options)
    }

    await document.startViewTransition(async () => {
      if (replace) {
        await originalReplace.call(router, to, options)
      } else {
        await originalPush.call(router, to, options)
      }
    }).finished
  }

  // 重写 router 方法
  router.push = (to, options) => navigateWithTransition(to, options, false)
  router.replace = (to, options) => navigateWithTransition(to, options, true)

  // 组件卸载时恢复原始方法
  tryOnScopeDispose(() => {
    router.push = originalPush
    router.replace = originalReplace
  })

  return {
    router,
    isSupported,
  }
}