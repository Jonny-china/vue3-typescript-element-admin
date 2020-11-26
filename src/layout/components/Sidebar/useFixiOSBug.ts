import { useSelector } from '@/hooks/vuex'
import { onMounted, ref } from 'vue'

export default function useFixOSBug() {
  const subMenuRef = ref()
  const { device } = useSelector(state => state.app)

  onMounted(() => {
    fixBugIniOS()
  })

  function fixBugIniOS() {
    const $subMenu = subMenuRef.value
    if ($subMenu) {
      const handleMouseleave = $subMenu.handleMouseleave
      $subMenu.handleMouseleave = (e: unknown) => {
        if (device.value === 'mobile') {
          return
        }
        handleMouseleave(e)
      }
    }
  }

  return { subMenuRef }
}
