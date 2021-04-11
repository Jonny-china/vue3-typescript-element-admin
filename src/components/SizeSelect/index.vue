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
import { app } from '@/main'
import { AppModule, TagsViewModule } from '@/store/modules'
import { ComponentSize } from '@/types/common'
import { ElMessage } from 'element-plus'
import { computed, defineComponent, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const SizeSelect = defineComponent({
  name: 'SizeSelect',
  setup() {
    const sizeOptions = [
      { label: 'Default', value: undefined },
      { label: 'Medium', value: 'medium' },
      { label: 'Small', value: 'small' },
      { label: 'Mini', value: 'mini' }
    ]

    const size = computed(() => AppModule.size)
    const $route = useRoute()
    const $router = useRouter()

    function handleSetSize(setSize: ComponentSize) {
      app.config.globalProperties.$ELEMENT.size = setSize
      console.log(app.config.globalProperties.$ELEMENT)
      AppModule.setSize(setSize)
      refreshView()
      ElMessage.warning('Switch Size Success')
    }

    function refreshView() {
      // In order to make the cached page re-rendered
      TagsViewModule.delAllCachedViews()

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
