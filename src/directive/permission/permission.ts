import { UserModule } from '@/store/modules'
import { Directive } from 'vue'

const permission: Directive = (el, binding) => {
  const { value } = binding
  const roles = UserModule.roles

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some((role: string) => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}
export default permission
