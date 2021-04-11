<script lang="tsx">
const MenuItem = ({ icon }: { icon: string }) => {
  if (icon) {
    if (icon.includes('el-icon')) {
      return <i class={[icon, 'sub-el-icon']} />
    } else {
      return <svg-icon icon-class={icon} />
    }
  }
  return null
}
export default MenuItem
</script>

<style lang="scss" scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
