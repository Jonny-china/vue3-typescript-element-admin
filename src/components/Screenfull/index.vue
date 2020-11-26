<template>
  <div>
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="click"
    />
  </div>
</template>

<script lang="ts">
import screenfull, { Screenfull } from 'screenfull'
import { Message } from 'element-plus'
import { onBeforeUnmount, onMounted, ref } from 'vue'

export default {
  name: 'Screenfull',
  setup() {
    const isFullscreen = ref(false)

    onBeforeUnmount(destroy)
    onMounted(init)

    function click() {
      if (!screenfull.isEnabled) {
        Message.warning('you browser can not work')
        return false
      }
      screenfull.toggle()
    }

    function change() {
      isFullscreen.value = (screenfull as Screenfull).isFullscreen
    }

    function init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', change)
      }
    }

    function destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', change)
      }
    }

    return { isFullscreen, click }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
