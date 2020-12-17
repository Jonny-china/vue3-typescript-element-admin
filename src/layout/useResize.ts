import { useDispatch, useSelector } from '@/hooks/vuex'
import { onBeforeMount, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const WIDTH = 992 // refer to Bootstrap's responsive design

export default function useResize() {
  const dispatch = useDispatch()
  const $route = useRoute()

  const { device, sidebar } = useSelector(state => state.app)

  watch(
    () => $route.fullPath,
    () => {
      if (device.value === 'mobile' && sidebar.value.opened) {
        dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }
  )

  onBeforeMount(() => {
    window.addEventListener('resize', $_resizeHandler)
  })

  onMounted(() => {
    const isMobile = $_isMobile()
    if (isMobile) {
      dispatch('app/toggleDevice', 'mobile')
      dispatch('app/closeSideBar', { withoutAnimation: true })
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
      dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

      if (isMobile) {
        dispatch('app/closeSideBar', { withoutAnimation: true })
      }
    }
  }
}
