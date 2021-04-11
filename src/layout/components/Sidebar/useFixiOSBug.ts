import { AppModule } from '@/store/modules'
import { onMounted, ref } from 'vue'

export default function useFixOSBug() {
  const subMenuRef = ref()

  onMounted(() => {
    fixBugIniOS()
  })

  function fixBugIniOS() {
    const $subMenu = subMenuRef.value
    if ($subMenu) {
      const handleMouseleave = $subMenu.handleMouseleave
      $subMenu.handleMouseleave = (e: unknown) => {
        if (AppModule.device === 'mobile') {
          return
        }
        handleMouseleave(e)
      }
    }
  }

  return { subMenuRef }
}
