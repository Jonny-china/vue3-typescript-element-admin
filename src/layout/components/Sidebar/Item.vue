<template>
  <i v-if="icon && icon.includes('el-icon')" :class="[icon, 'sub-el-icon']" />
  <svg-icon v-else :icon-class="icon" />
  <span>{{ title }}</span>
</template>

<script lang="tsx">
import { defineComponent } from 'vue'

const MenuItem = defineComponent({
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
})
export default MenuItem
</script>

<style lang="scss" scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
