<template>
  <div class="notif-center" ref="root">
    <!-- 铃铛按钮 -->
    <button
      class="notif-bell"
      :class="{ active: panelOpen }"
      :aria-label="t('notification.title')"
      @click.stop="togglePanel"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" class="bell-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
    </button>

    <!-- 通知面板 -->
    <transition name="notif-panel">
      <div v-if="panelOpen && !selectedNotif" class="notif-panel" @click.stop>
        <div class="notif-panel-header">
          <span class="notif-panel-title">{{ t('notification.title') }}</span>
          <button
            v-if="unreadCount > 0"
            class="notif-mark-all"
            @click.stop="markAllRead"
          >
            {{ t('notification.markAllRead') }}
          </button>
        </div>

        <div class="notif-panel-body">
          <div v-if="loading" class="notif-loading">
            <div class="page-spinner"></div>
          </div>
          <div v-else-if="activeNotifications.length === 0" class="notif-empty">
            <span>{{ t('notification.empty') }}</span>
          </div>
          <div v-else class="notif-list">
            <div
              v-for="notif in visibleNotifications"
              :key="notif.id"
              class="notif-item"
              :class="{ unread: !isRead(notif) }"
              @click.stop="openDetail(notif)"
            >
              <div class="notif-item-dot" :class="`type-${notif.type || 'info'}`"></div>
              <div class="notif-item-content">
                <div class="notif-item-header">
                  <span class="notif-item-title">{{ getTitle(notif) }}</span>
                  <span class="notif-item-date">{{ relTime(notif.datetime || notif.date) }}</span>
                </div>
                <p class="notif-item-text">{{ getContent(notif) }}</p>
                <div v-if="!isRead(notif)" class="notif-item-unread-tag">{{ t('notification.unread') }}</div>
              </div>
            </div>

            <div v-if="hasMore" class="notif-view-all" @click.stop="goToAllNotifications">
              <span>{{ t('notification.viewAll') }}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <!-- 详情弹窗 — Teleport 到 body 避免被父容器裁剪 -->
  <Teleport to="body">
    <transition name="notif-detail">
      <div v-if="selectedNotif" class="notif-detail-overlay" @click.self="closeDetail">
        <div class="notif-detail-modal">
          <div class="notif-detail-header">
            <div class="notif-detail-header-left">
              <div class="notif-detail-dot" :class="`type-${selectedNotif.type || 'info'}`"></div>
              <span class="notif-detail-type">{{ typeLabel(selectedNotif.type) }}</span>
            </div>
            <button class="notif-detail-close" @click="closeDetail" :aria-label="t('notification.close')">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="notif-detail-body">
            <h3 class="notif-detail-title">{{ getTitle(selectedNotif) }}</h3>
            <div class="notif-detail-meta">
              <span class="notif-detail-date">{{ fullDateTime(selectedNotif.datetime || selectedNotif.date) }}</span>
              <span v-if="isRead(selectedNotif)" class="notif-detail-read-tag">{{ t('notification.readTag') }}</span>
            </div>
            <div class="notif-detail-content">{{ getContent(selectedNotif) }}</div>

            <a
              v-if="selectedNotif.link && selectedNotif.linkText"
              :href="selectedNotif.link"
              :target="isExternal(selectedNotif.link) ? '_blank' : undefined"
              :rel="isExternal(selectedNotif.link) ? 'noopener' : undefined"
              class="notif-detail-link"
              @click="onLinkClick($event, selectedNotif.link)"
            >
              {{ getLinkText(selectedNotif) }} →
            </a>

            <button class="notif-detail-view-all" @click="goToAllNotifications">
              {{ t('notification.viewAll') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useFetchData } from '@/composables/useFetchData'
import { useNotificationReadState } from '@/composables/useNotificationReadState'
import { formatRelativeTime, formatFullDateTime } from '@/composables/useNotificationHelpers'

const MAX_VISIBLE = 5

const emit = defineEmits(['navigate'])

const { t, locale } = useI18n()
const router = useRouter()

const { isRead, markAsRead, markAllRead: markAllReadShared } = useNotificationReadState()

const root = ref(null)
const panelOpen = ref(false)
const selectedNotif = ref(null)

const { data: notifData, loading } = useFetchData('/data/notification/notifications.json')

const sortedNotifications = computed(() => {
  if (!notifData.value || !notifData.value.notifications) return []
  return [...notifData.value.notifications]
    .filter(n => n.active)
    .sort((a, b) => new Date(b.datetime || b.date) - new Date(a.datetime || a.date))
})

const activeNotifications = computed(() => sortedNotifications.value)

const visibleNotifications = computed(() => {
  return sortedNotifications.value.slice(0, MAX_VISIBLE)
})

const hasMore = computed(() => {
  return sortedNotifications.value.length > MAX_VISIBLE
})

const unreadCount = computed(() => {
  return activeNotifications.value.filter(n => !isRead(n)).length
})

// 包装函数 — 确保传入 locale / t
function relTime(dt) {
  return formatRelativeTime(dt, locale.value)
}

function fullDateTime(dt) {
  return formatFullDateTime(dt, locale.value)
}

function typeLabel(type) {
  const map = {
    info: t('notification.typeInfo'),
    update: t('notification.typeUpdate'),
    warning: t('notification.typeWarning'),
    announcement: t('notification.typeAnnouncement')
  }
  return map[type] || map.info
}

function markAllRead() {
  markAllReadShared(activeNotifications.value)
}

function togglePanel() {
  panelOpen.value = !panelOpen.value
  if (panelOpen.value) {
    selectedNotif.value = null
  }
}

function closePanel() {
  panelOpen.value = false
}

function openDetail(notif) {
  selectedNotif.value = notif
  markAsRead(notif.id)
  // 移动端：详情弹出时收起展开的导航菜单
  emit('navigate')
}

function closeDetail() {
  selectedNotif.value = null
}

function goToAllNotifications() {
  selectedNotif.value = null
  panelOpen.value = false
  emit('navigate')
  router.push('/notifications')
}

function isExternal(link) {
  return /^(https?:)?\/\//.test(link)
}

// 站内链接走路由跳转，避免整页刷新
function onLinkClick(e, link) {
  if (isExternal(link)) return
  e.preventDefault()
  selectedNotif.value = null
  panelOpen.value = false
  emit('navigate')
  router.push(link)
}

function getTitle(notif) {
  return locale.value === 'en' && notif.titleEn ? notif.titleEn : notif.title
}

function getContent(notif) {
  return locale.value === 'en' && notif.contentEn ? notif.contentEn : notif.content
}

function getLinkText(notif) {
  if (locale.value === 'en' && notif.linkTextEn) return notif.linkTextEn
  return notif.linkText
}

function handleClickOutside(e) {
  if (root.value && !root.value.contains(e.target)) {
    closePanel()
  }
}

function handleEscape(e) {
  if (e.key === 'Escape') {
    if (selectedNotif.value) {
      closeDetail()
    } else if (panelOpen.value) {
      closePanel()
    }
  }
}

// 详情弹窗打开时锁定页面滚动，避免移动端背景滚动穿透
watch(selectedNotif, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>
