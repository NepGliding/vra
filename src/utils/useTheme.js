import { useDark } from '@vueuse/core'

export function useTheme() {
  const isDark = useDark({
    storageKey: 'theme',
    // 深色class名称，浅色时移除class（不添加额外class）
    valueDark: 'dark',
    valueLight: '',
  })
  const toggleDark = () => {
    isDark.value = !isDark.value
  }
  return { isDark, toggleDark }
}
