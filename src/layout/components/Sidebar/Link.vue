<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script lang="ts">
import { isExternal } from '@/utils/validate'
import { computed, defineComponent } from 'vue'

const Link = defineComponent({
  name: 'Link',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const external = computed(() => isExternal(props.to))
    const type = computed(() => {
      if (external.value) {
        return 'a'
      }
      return 'router-link'
    })
    function linkProps(to: string) {
      if (external.value) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
    return { linkProps, isExternal: external, type }
  }
})
export default Link
</script>
