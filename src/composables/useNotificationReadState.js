import { ref } from 'vue'

const STORAGE_KEY = 'hcpgn-read-notifications'

/**
 * 已读状态（模块级共享，所有组件共用同一实例）
 * 存储结构：{ ids: string[], lastReadAt: string|null }
 * - ids        单条通知的已读记录
 * - lastReadAt 「全部已读」水位线：早于该时间发布的通知一律视为已读
 *
 * 水位线的作用：后台更新 notifications.json（新增/修改条目）后，
 * 老通知不会因为数据变动而重新变成未读，只有比水位线更新的通知才提醒。
 */
const readIds = ref(new Set())
const lastReadAt = ref(null)

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) {
      // 兼容旧格式：纯 id 数组
      readIds.value = new Set(parsed)
      lastReadAt.value = null
    } else if (parsed && typeof parsed === 'object') {
      readIds.value = new Set(parsed.ids || [])
      lastReadAt.value = parsed.lastReadAt || null
    }
  } catch {
    readIds.value = new Set()
    lastReadAt.value = null
  }
}

load()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ids: [...readIds.value],
      lastReadAt: lastReadAt.value
    }))
  } catch {
    /* 隐私模式等场景下写入失败，忽略 */
  }
}

function getTime(notif) {
  const raw = notif && (notif.datetime || notif.date)
  if (!raw) return null
  const time = new Date(raw).getTime()
  return Number.isNaN(time) ? null : time
}

/**
 * 判断是否已读
 * @param {object|string} notifOrId 通知对象（推荐）或 id
 */
function isRead(notifOrId) {
  if (!notifOrId) return false
  if (typeof notifOrId === 'string') return readIds.value.has(notifOrId)

  if (readIds.value.has(notifOrId.id)) return true
  if (!lastReadAt.value) return false

  const notifTime = getTime(notifOrId)
  const waterline = new Date(lastReadAt.value).getTime()
  if (notifTime === null || Number.isNaN(waterline)) return false
  return notifTime <= waterline
}

function markAsRead(id) {
  if (!id || readIds.value.has(id)) return
  readIds.value = new Set([...readIds.value, id])
  persist()
}

/**
 * 全部已读：记录 id 并抬高水位线
 * @param {Array} notifs 通知对象数组（也兼容 id 数组）
 */
function markAllRead(notifs) {
  const merged = new Set(readIds.value)
  let maxTime = lastReadAt.value ? new Date(lastReadAt.value).getTime() : 0
  if (Number.isNaN(maxTime)) maxTime = 0

  ;(notifs || []).forEach(item => {
    if (typeof item === 'string') {
      merged.add(item)
      return
    }
    if (!item) return
    merged.add(item.id)
    const time = getTime(item)
    if (time !== null && time > maxTime) maxTime = time
  })

  // 水位线取「最新一条通知时间」与「当前时间」中较大者
  const now = Date.now()
  lastReadAt.value = new Date(Math.max(maxTime, now)).toISOString()
  readIds.value = merged
  persist()
}

// 跨标签页同步
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    load()
  }
})

export function useNotificationReadState() {
  return { readIds, lastReadAt, isRead, markAsRead, markAllRead }
}
