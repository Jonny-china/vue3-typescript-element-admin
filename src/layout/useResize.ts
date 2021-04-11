import { AppModule } from '@/store/modules'
import { onBeforeMount, onBeforeUnmount, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const WIDTH = 992 // refer to Bootstrap's responsive design

export default function useResize() {
  const $route = useRoute()

  const device = computed(() => AppModule.device)
  const sidebar = computed(() => AppModule.sidebar)

  watch(
    () => $route.fullPath,
    () => {
      if (device.value === 'mobile' && sidebar.value.opened) {
        AppModule.closeSideBar({ withoutAnimation: false })
      }
    }
  )

  onBeforeMount(() => {
    window.addEventListener('resize', $_resizeHandler)
  })

  onMounted(() => {
    const isMobile = $_isMobile()
    if (isMobile) {
      AppModule.toggleDevice('mobile')
      AppModule.closeSideBar({ withoutAnimation: true })
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', $_resizeHandler)
  })

  // use $_ for mixins properties
  // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
  function $_isMobile() {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  function $_resizeHandler() {
    if (!document.hidden) {
      const isMobile = $_isMobile()
      AppModule.toggleDevice(isMobile ? 'mobile' : 'desktop')

      if (isMobile) {
        AppModule.closeSideBar({ withoutAnimation: true })
      }
    }
  }
}
