<template>
  <div v-if="errorLogs.length > 0">
    <el-badge
      :is-dot="true"
      style="line-height: 25px; margin-top: -5px"
      @click="dialogTableVisible = true"
    >
      <el-button style="padding: 8px 10px" size="small" type="danger">
        <svg-icon icon-class="bug" />
      </el-button>
    </el-badge>

    <el-dialog v-model:visible="dialogTableVisible" width="80%" append-to-body>
      <template #title>
        <div>
          <span style="padding-right: 10px">Error Log</span>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-delete"
            @click="clearAll"
            >Clear All</el-button
          >
        </div>
      </template>
      <el-table :data="errorLogs" border>
        <el-table-column label="Message">
          <template v-slot="{ row }">
            <div>
              <span class="message-title">Msg:</span>
              <el-tag type="danger">
                {{ row.err.message }}
              </el-tag>
            </div>
            <br />
            <div>
              <span class="message-title" style="padding-right: 10px"
                >Info:
              </span>
              <el-tag type="warning">
                {{ row.vm.$vnode.tag }} error in {{ row.info }}
              </el-tag>
            </div>
            <br />
            <div>
              <span class="message-title" style="padding-right: 16px"
                >Url:
              </span>
              <el-tag type="success">
                {{ row.url }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Stack">
          <template v-slot="scope">
            {{ scope.row.err.stack }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ErrorLogModule } from '@/store/modules'
import { computed, defineComponent, ref } from 'vue'

const ErrorLog = defineComponent({
  name: 'ErrorLog',
  setup() {
    const dialogTableVisible = ref(false)

    function clearAll() {
      dialogTableVisible.value = false
      ErrorLogModule.clearErrorLog()
    }

    return {
      dialogTableVisible,
      errorLogs: computed(() => ErrorLogModule.logs),
      clearAll
    }
  }
})
export default ErrorLog
</script>

<style scoped>
.message-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  padding-right: 8px;
}
</style>
