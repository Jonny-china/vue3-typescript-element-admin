import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const { params, query } = useRoute()
    const { path } = params
    useRouter().replace({ path: '/' + path, query })
  }
})
