<template>
  <div id="tags-view-container" ref="tagsViewRef" class="tags-view-container">
    <scroll-pane
      ref="scrollPaneRef"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        ref="tagRef"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        Close
      </li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script lang="ts">
import ScrollPane from './ScrollPane.vue'
import path from 'path'
import { defineComponent, nextTick, onMounted, ref, watch, computed } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router'
import { RouteRecordRaw } from 'vue-router'
import { PermissionModule, TagsViewModule } from '@/store/modules'

const TagsView = defineComponent({
  name: 'TagsView',
  components: { ScrollPane },
  setup() {
    const visible = ref(false)
    const top = ref(0)
    const left = ref(0)
    const selectedTag = ref({} as RouteLocationNormalizedLoaded)
    const affixTags = ref<any[]>([])

    const tagRef = ref()
    const tagsViewRef = ref<HTMLElement>()
    const scrollPaneRef = ref()

    const $route = useRoute()
    const $router = useRouter()

    watch(
      () => $route.fullPath,
      () => {
        initTags()
        addTags()
      }
    )
    watch(visible, (value: boolean) => {
      if (value) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
      }
    })

    onMounted(() => {
      initTags()
      addTags()
    })

    function isActive(route: RouteRecordRaw) {
      return route?.path === $route.path
    }
    function isAffix(tag?: RouteRecordRaw) {
      return tag?.meta?.affix
    }
    function filterAffixTags(routeList: RouteRecordRaw[], basePath = '/') {
      let tags: any[] = []
      routeList.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    }
    function initTags() {
      const affix = (affixTags.value = filterAffixTags(
        PermissionModule.routes as RouteRecordRaw[]
      ))
      for (const tag of affix) {
        // Must have tag name
        if (tag.name) {
          TagsViewModule.addVisitedView(tag)
        }
      }
    }
    function addTags() {
      const { name } = $route
      if (name) {
        console.log(name)
        TagsViewModule.addView($route)
      }
      return false
    }
    function moveToCurrentTag() {
      const tags = tagRef.value
      console.log('tags: ', tags)
      nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === $route.path) {
            scrollPaneRef.value.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== $route.fullPath) {
              TagsViewModule.updateVisitedView($route)
            }
            break
          }
        }
      })
    }
    function refreshSelectedTag(view: RouteLocationNormalizedLoaded) {
      TagsViewModule.delCachedView(view).then(() => {
        const { fullPath } = view
        nextTick(() => {
          $router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    }
    function closeSelectedTag(view: any) {
      TagsViewModule.delView(view).then(({ visitedViews }) => {
        if (isActive(view)) {
          toLastView(visitedViews, view)
        }
      })
    }
    function closeOthersTags() {
      $router.push(selectedTag.value)
      TagsViewModule.delOthersViews(selectedTag.value as any).then(() => {
        moveToCurrentTag()
      })
    }
    function closeAllTags(view: any) {
      TagsViewModule.delAllViews().then(({ visitedViews }) => {
        if (affixTags.value.some(tag => tag.path === view.path)) {
          return
        }
        toLastView(visitedViews, view)
      })
    }
    function toLastView(visitedViews: any[], view: any) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        $router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          $router.replace({ path: '/redirect' + view.fullPath })
        } else {
          $router.push('/')
        }
      }
    }
    function openMenu(tag: any, e: any) {
      const menuMinWidth = 105
      const offsetLeft = tagsViewRef.value?.getBoundingClientRect().left ?? 0 // container margin left
      const offsetWidth = tagsViewRef.value?.offsetWidth ?? 0 // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const mgleft = e.clientX - offsetLeft + 15 // 15: margin right

      if (mgleft > maxLeft) {
        left.value = maxLeft
      } else {
        left.value = mgleft
      }

      top.value = e.clientY
      visible.value = true
      selectedTag.value = tag
    }
    function closeMenu() {
      visible.value = false
    }

    function handleScroll() {
      closeMenu()
    }
    return {
      tagRef,
      tagsViewRef,
      scrollPaneRef,
      left,
      top,
      visible,
      visitedViews: computed(() => TagsViewModule.visitedViews),
      selectedTag,
      isActive,
      isAffix,
      handleScroll,
      openMenu,
      refreshSelectedTag,
      closeSelectedTag,
      closeOthersTags,
      closeAllTags
    }
  }
})
export default TagsView
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
