const settings = require('@/settings')

const title = settings.title || 'Vue Element Admin'

export default function getPageTitle(pageTitle: string) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
