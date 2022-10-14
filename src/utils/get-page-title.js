import defaultSettings from '@/settings'

const title = defaultSettings.title || '低收入农户精准帮扶系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
