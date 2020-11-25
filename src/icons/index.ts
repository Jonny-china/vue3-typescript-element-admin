import SvgIcon from '@/components/SvgIcon/index.vue' // svg component

const req = require.context('./svg', false, /\.svg$/)
const requireAll = (requireContext: __WebpackModuleApi.RequireContext) =>
  requireContext.keys().map(requireContext)
requireAll(req)

export default SvgIcon
