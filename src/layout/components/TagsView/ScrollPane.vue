<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  getCurrentInstance
} from 'vue'

const tagAndTagSpacing = 4 // tagAndTagSpacing

const ScrollPane = defineComponent({
  name: 'ScrollPane',
  data() {
    return {
      left: 0
    }
  },
  setup(props, { emit }) {
    const app = getCurrentInstance()

    const scrollContainer = ref()
    const scrollWrapper = computed<HTMLBaseElement>(
      () => scrollContainer.value?.wrap
    )

    onMounted(() => {
      scrollWrapper.value.addEventListener('scroll', emitScroll, true)
    })
    onBeforeUnmount(() => {
      scrollWrapper.value.removeEventListener('scroll', emitScroll)
    })

    function emitScroll() {
      emit('scroll')
    }

    function handleScroll(e: any) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = scrollWrapper.value
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    }
    function moveToTarget(currentTag: any) {
      const $container = scrollContainer.value.ctx.$el
      const $containerWidth = $container.offsetWidth
      const $scrollWrapper = scrollWrapper.value
      const tagList = app?.parent?.refs.tagRef as any

      let firstTag = null
      let lastTag = null

      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }

      if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0
      } else if (lastTag === currentTag) {
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex(
          (item: any) => item === currentTag
        )
        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]
        console.log('nextTag, ', nextTag)
        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft =
          nextTag.ctx.$el.offsetLeft +
          nextTag.ctx.$el.offsetWidth +
          tagAndTagSpacing

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft =
          prevTag.ctx.$el.offsetLeft - tagAndTagSpacing

        if (
          afterNextTagOffsetLeft >
          $scrollWrapper.scrollLeft + $containerWidth
        ) {
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    }

    return {
      scrollContainer,
      handleScroll,
      moveToTarget
    }
  }
})
export default ScrollPane
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>
