import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const { params, query } = useRoute()
    const { path } = params
    const router = useRouter()
    router.replace({ path: '/' + path, query })
    return () => <div></div>
  }
})
