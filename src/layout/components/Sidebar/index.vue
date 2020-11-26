<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import stylesVariables from '@/styles/variables.scss'
import { useGetters, useSelector } from '@/hooks/vuex'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

const Sidebar = defineComponent({
  name: 'Sidebar',
  components: { SidebarItem, Logo },
  setup() {
    const route = useRoute()
    const activeMenu = computed(() => {
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })
    const { permission_routes, sidebar } = useGetters()
    const variables = computed(() => stylesVariables)
    const isCollapse = computed(() => !sidebar.opened)

    const { sidebarLogo: showLogo } = useSelector(state => state.settings)

    return {
      permission_routes,
      sidebar,
      activeMenu,
      showLogo,
      variables,
      isCollapse
    }
  }
})
export default Sidebar
</script>
