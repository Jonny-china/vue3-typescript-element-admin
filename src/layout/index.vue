<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebarOpen"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>

      <app-main />

      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script lang="ts">
import RightPanel from '@/components/RightPanel/index.vue'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import { computed, defineComponent } from 'vue'
import useResize from './useResize'
import { AppModule, SettingsModule } from '@/store/modules'

const Layout = defineComponent({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  setup() {
    useResize()
    const device = computed(() => AppModule.device)
    const sidebarOpen = computed(() => AppModule.sidebar.opened)

    const classObj = computed(() => ({
      hideSidebar: !sidebarOpen.value,
      openSidebar: sidebarOpen.value,
      withoutAnimation: AppModule.sidebar.withoutAnimation,
      mobile: device.value === 'mobile'
    }))

    return {
      sidebarOpen,
      device,
      showSettings: computed(() => SettingsModule.showSettings),
      needTagsView: computed(() => SettingsModule.tagsView),
      fixedHeader: computed(() => SettingsModule.fixedHeader),
      classObj,
      handleClickOutside: () =>
        AppModule.closeSideBar({ withoutAnimation: false })
    }
  }
})
export default Layout
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
