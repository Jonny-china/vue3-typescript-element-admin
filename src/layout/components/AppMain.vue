<template>
  <section class="app-main">
    <router-view :key="key" v-slot="{ Component }">
      <keep-alive :include="cachedViews">
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" />
        </transition>
      </keep-alive>
    </router-view>
  </section>
</template>

<script lang="ts">
import { useSelector } from '@/hooks/vuex'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

const AppMain = defineComponent({
  name: 'AppMain',
  setup() {
    const { path } = useRoute()
    const { cachedViews } = useSelector(state => state.tagsView)
    return { key: path, cachedViews }
  }
})

export default AppMain
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
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
