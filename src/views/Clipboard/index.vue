<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="use clipboard  directly" name="directly">
      <el-input
        v-model="inputData"
        placeholder="Please input"
        style="width: 400px; max-width: 100%"
      />
      <el-button
        type="primary"
        icon="el-icon-document"
        @click="handleCopy(inputData, $event)"
      >
        copy
      </el-button>
    </el-tab-pane>
    <el-tab-pane label="use clipboard by v-directive" name="v-directive">
      <el-input
        v-model="inputData"
        placeholder="Please input"
        style="width: 400px; max-width: 100%"
      />
      <el-button
        v-clipboard="inputData"
        v-clipboard:success="clipboardSuccess"
        type="primary"
        icon="el-icon-document"
      >
        copy
      </el-button>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, ref } from 'vue'
import clipboard from '@/directive/clipboard'
import clip from '@/utils/clipboard'

const Clipboard = defineComponent({
  name: 'Clipboard',
  directives: { clipboard },
  setup() {
    const activeName = ref('directly')
    const inputData = ref('https://github.com/PanJiaChen/vue-element-admin')

    const handleCopy = (text: string, event: Event) => {
      clip(text, event)
    }

    const clipboardSuccess = () => {
      ElMessage({
        message: 'Directive Copy successfully',
        type: 'success',
        duration: 1500
      })
    }
    return { handleCopy, clipboardSuccess, activeName, inputData }
  }
})

export default Clipboard
</script>

<style lang="scss" scoped></style>
