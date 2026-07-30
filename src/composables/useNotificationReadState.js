import { ref } from 'vue'

const STORAGE_KEY = 'hcpgn-read-notifications'

// 模块级共享状态 — 所有使用本 composable 的组件共享同一个响应式实例
const readIds = ref(new Set())

// 首次加载
try {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    readIds.value = new Set(JSON.parse(stored))
  }
} catch {
  readIds.value = new Set()
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...readIds.value]))
}

function isRead(id) {
  return readIds.value.has(id)
}

function markAsRead(id) {
  if (!readIds.value.has(id)) {
    readIds.value = new Set([...readIds.value, id])
    persist()
  }
}

function markAllRead(ids) {
  const merged = new Set(readIds.value)
  ;(ids || []).forEach(id => merged.add(id))
  readIds.value = merged
  persist()
}

// 跨标签页同步（其他标签页修改后本标签页自动更新）
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY && e.newValue) {
    try {
      readIds.value = new Set(JSON.parse(e.newValue))
    } catch {
      /* ignore */
    }
  }
})

export function useNotificationReadState() {
  return { readIds, isRead, markAsRead, markAllRead }
}
