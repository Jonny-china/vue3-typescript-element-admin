<template>
  <el-color-picker
    v-model="theme"
    :predefine="[
      '#409EFF',
      '#1890ff',
      '#304156',
      '#212121',
      '#11a983',
      '#13c2c2',
      '#6959CD',
      '#f5222d'
    ]"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script lang="ts">
import { SettingsModule } from '@/store/modules'
import { ElMessage } from 'element-plus'
import { computed, defineComponent, ref, watch } from 'vue'

const version = require('element-plus/package.json').version // element-plus version from node_modules
const ORIGINAL_THEME = '#409EFF' // default color

const ThemePicker = defineComponent({
  name: 'ThemePicker',
  setup(props, { emit }) {
    let chalk = '' // content of theme-chalk css
    const theme = ref('')

    const defaultTheme = computed(() => SettingsModule.theme)

    watch(
      defaultTheme,
      (val: string) => {
        theme.value = val
      },
      {
        immediate: true
      }
    )

    watch(theme, async (val: string) => {
      const oldVal = chalk ? theme.value : ORIGINAL_THEME
      if (typeof val !== 'string') return
      const themeCluster = getThemeCluster(val.replace('#', ''))
      const originalCluster = getThemeCluster(oldVal.replace('#', ''))
      const $message = ElMessage({
        message: 'Compiling the theme',
        customClass: 'theme-message',
        type: 'success',
        duration: 0,
        iconClass: 'el-icon-loading'
      })

      const getHandler = (variable: string, id: string) => {
        return () => {
          const originalCluster = getThemeCluster(
            ORIGINAL_THEME.replace('#', '')
          )
          const newStyle = updateStyle(variable, originalCluster, themeCluster)

          let styleTag = document.getElementById(id)
          if (!styleTag) {
            styleTag = document.createElement('style')
            styleTag.setAttribute('id', id)
            document.head.appendChild(styleTag)
          }
          styleTag.innerText = newStyle
        }
      }

      if (!chalk) {
        const url = `https://unpkg.com/element-plus@${version}/lib/theme-chalk/index.css`
        await getCSSString(url, 'chalk')
      }

      const chalkHandler = getHandler(chalk, 'chalk-style')

      chalkHandler()

      const styles: HTMLStyleElement[] = [].slice
        .call(document.querySelectorAll('style'))
        .filter((style: HTMLStyleElement) => {
          const text = style.innerText
          return (
            new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
          )
        })
      styles.forEach(style => {
        const { innerText } = style
        if (typeof innerText !== 'string') return
        style.innerText = updateStyle(innerText, originalCluster, themeCluster)
      })

      emit('change', val)

      $message?.close()
    })

    function updateStyle(
      style: string,
      oldCluster: string[],
      newCluster: string[]
    ) {
      let newStyle = style
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
      })
      return newStyle
    }

    function getCSSString(url: string, variable: 'theme' | 'chalk') {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            const color = xhr.responseText.replace(/@font-face{[^}]+}/, '')
            if (variable === 'theme') {
              theme.value = color
            } else {
              chalk = color
            }
            resolve(color)
          }
        }
        xhr.open('GET', url)
        xhr.send()
      })
    }

    function getThemeCluster(theme: string) {
      const tintColor = (color: string, tint: number) => {
        let red: string | number = parseInt(color.slice(0, 2), 16)
        let green: string | number = parseInt(color.slice(2, 4), 16)
        let blue: string | number = parseInt(color.slice(4, 6), 16)

        if (tint === 0) {
          // when primary color is in its rgb space
          return [red, green, blue].join(',')
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))

          red = red.toString(16)
          green = green.toString(16)
          blue = blue.toString(16)

          return `#${red}${green}${blue}`
        }
      }

      const shadeColor = (color: string, shade: number) => {
        let red: string | number = parseInt(color.slice(0, 2), 16)
        let green: string | number = parseInt(color.slice(2, 4), 16)
        let blue: string | number = parseInt(color.slice(4, 6), 16)

        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)

        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)

        return `#${red}${green}${blue}`
      }

      const clusters = [theme]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(theme, 0.1))
      return clusters
    }

    return { theme }
  }
})
export default ThemePicker
</script>

<style>
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
