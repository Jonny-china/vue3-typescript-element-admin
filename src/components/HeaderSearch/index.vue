<template>
  <div :class="{ show: show }" class="header-search">
    <svg-icon
      class-name="search-icon"
      icon-class="search"
      @click.stop="click"
    />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.path"
        :value="item"
        :label="item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import { RouteRecordRaw } from 'vue-router'
import Fuse from 'fuse.js'
import path from 'path'
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { PermissionModule } from '@/store/modules'

type Pool = { path: string; title: string[] }

const HeaderSearch = defineComponent({
  name: 'HeaderSearch',
  setup() {
    const search = ref('')
    const options = ref<Fuse.FuseResult<Pool>[]>([])
    const searchPool = ref<Pool[]>([])
    const show = ref(false)
    const fuse = ref<Fuse<Pool>>()

    const headerSearchSelect = ref<HTMLInputElement>()

    const $router = useRouter()
    const routes = computed(() => PermissionModule.routes)

    watch(
      routes,
      val => {
        searchPool.value = generateRoutes(val as RouteRecordRaw[])
      },
      {
        deep: true
      }
    )
    watch(searchPool, initFuse)

    watch(show, value => {
      if (value) {
        document.body.addEventListener('click', close)
      } else {
        document.body.removeEventListener('click', close)
      }
    })

    onMounted(() => {
      searchPool.value = generateRoutes(routes.value as RouteRecordRaw[])
    })

    function click() {
      show.value = !show.value
      if (show.value) {
        headerSearchSelect.value?.focus()
      }
    }
    function close() {
      headerSearchSelect.value?.blur()
      options.value = []
      show.value = false
    }
    function change(val: Pool) {
      $router.push(val.path)
      search.value = ''
      options.value = []
      nextTick(() => {
        show.value = false
      })
    }
    function initFuse(list: Pool[]) {
      fuse.value = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [
          {
            name: 'title',
            weight: 0.7
          },
          {
            name: 'path',
            weight: 0.3
          }
        ]
      })
    }
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    function generateRoutes(
      routes: RouteRecordRaw[],
      basePath = '/',
      prefixTitle: string[] = []
    ) {
      let res: Pool[] = []

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) {
          continue
        }

        const data: Pool = {
          path: path.resolve(basePath, router.path) as string,
          title: [...prefixTitle]
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = generateRoutes(
            router.children,
            data.path,
            data.title
          )
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    }

    function querySearch(query: string) {
      if (query !== '') {
        options.value = fuse.value?.search(query) ?? []
      } else {
        options.value = []
      }
    }

    return {
      show,
      search,
      options,
      click,
      change,
      headerSearchSelect,
      querySearch
    }
  }
})
export default HeaderSearch
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    :deep(.el-input__inner) {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
