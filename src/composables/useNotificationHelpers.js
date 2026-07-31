/**
 * 格式化相对时间
 * - 1小时内: "x分钟前"
 * - 24小时内: "x小时前"
 * - 7天内: "x天前"
 * - 超过7天: 显示完整日期
 */
export function formatRelativeTime(datetime, locale = 'zh') {
  if (!datetime) return ''

  const now = new Date()
  const target = new Date(datetime)
  const diffMs = now - target
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) {
    return locale === 'en' ? 'Just now' : '刚刚'
  }

  if (diffMin < 60) {
    return locale === 'en'
      ? `${diffMin} min${diffMin > 1 ? 's' : ''} ago`
      : `${diffMin}分钟前`
  }

  if (diffHour < 24) {
    return locale === 'en'
      ? `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
      : `${diffHour}小时前`
  }

  if (diffDay < 7) {
    return locale === 'en'
      ? `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
      : `${diffDay}天前`
  }

  // 超过7天显示完整日期
  return formatFullDateTime(datetime, locale)
}

/**
 * 格式化完整日期时间
 * 中文: 2026年7月30日 17:00
 * 英文: Jul 30, 2026 5:00 PM
 */
export function formatFullDateTime(datetime, locale = 'zh') {
  if (!datetime) return ''

  const dt = new Date(datetime)

  if (locale === 'en') {
    return dt.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return dt.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

/**
 * 通知类型配置（不含翻译，翻译由调用方通过 t() 完成）
 */
export const NOTIF_TYPES = ['info', 'update', 'warning', 'announcement']
