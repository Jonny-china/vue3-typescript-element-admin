import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'

function clipboardSuccess() {
  ElMessage({
    message: 'Copy successfully',
    type: 'success',
    duration: 1500
  })
}

function clipboardError() {
  ElMessage({
    message: 'Copy failed',
    type: 'error'
  })
}

export default function clip(text: string, event: Event) {
  const clipboard = new Clipboard(
    event.target as string | Element | NodeListOf<Element>,
    {
      text: () => text
    }
  )
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  ;(clipboard as any).onClick(event)
}
