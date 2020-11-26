<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetSize">
      <div>
        <svg-icon class-name="size-icon" icon-class="size" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item of sizeOptions"
            :key="item.value"
            :disabled="size === item.value"
            :command="item.value"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { useDispatch, useGetters } from '@/hooks/vuex'
import { Message } from 'element-plus'
import { ElementUIComponentSize } from 'element-plus/types/component'
import { defineComponent, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const SizeSelect = defineComponent({
  name: 'SizeSelect',
  setup() {
    const sizeOptions = [
      { label: 'Default', value: 'default' },
      { label: 'Medium', value: 'medium' },
      { label: 'Small', value: 'small' },
      { label: 'Mini', value: 'mini' }
    ]

    const dispatch = useDispatch()
    const { size } = useGetters()
    const $route = useRoute()
    const $router = useRouter()

    function handleSetSize(setSize: ElementUIComponentSize) {
      // this.$ELEMENT.size = size
      dispatch('app/setSize', setSize)
      refreshView()
      Message.warning('Switch Size Success')
    }

    function refreshView() {
      // In order to make the cached page re-rendered
      dispatch('tagsView/delAllCachedViews', $route)

      const { fullPath } = $route

      nextTick(() => {
        $router.replace({
          path: '/redirect' + fullPath
        })
      })
    }

    return { sizeOptions, handleSetSize, size }
  }
})
export default SizeSelect
</script>
