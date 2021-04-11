<template>
  <section class="app-main">
    <router-view :key="key" v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts">
import { TagsViewModule } from '@/store/modules'
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const AppMain = defineComponent({
  name: 'AppMain',
  setup() {
    const { path } = useRoute()
    const cachedViews = ref(TagsViewModule.cachedViews)
    console.log(cachedViews.value)
    watch(cachedViews, val => {
      console.log(val)
    })
    return { key: path, cachedViews }
  }
})

export default AppMain
</script>

<style lang="scss" scoped>
.app-main {
  /* 90 = navbar + wrap padding = 50 + 40 */
  min-height: calc(100vh - 90px);
  padding: 20px;
  width: calc(100% - 40px);
  position: relative;
  overflow: hidden;
  box-sizing: content-box;
}

.fixed-header + .app-main {
  /* 70 = navbar + wrap padding top = 50 + 20 */
  padding-top: 70px;
}

.hasTagsView {
  .app-main {
    /* 124 = navbar + tags-view + wrap padding = 50 + 34 + 40 */
    min-height: calc(100vh - 124px);
  }

  /* 104 = navbar + tags-view wrap padding top = 50 + 34 + 20 */
  .fixed-header + .app-main {
    padding-top: 104px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
