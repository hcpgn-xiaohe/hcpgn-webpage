<template>
  <div class="notifications-page">
    <div class="notifications-page-inner">
      <h1 class="notifications-page-title">{{ t('notification.title') }}</h1>
      <p class="notifications-page-subtitle">{{ t('notification.allSubtitle') }}</p>

      <div v-if="loading" class="page-loading">
        <div class="page-spinner"></div>
      </div>

      <div v-else-if="error" class="page-empty">
        <span>{{ t('common.loadFailed') }}</span>
      </div>

      <div v-else-if="activeNotifications.length === 0" class="page-empty">
        <span>{{ t('notification.empty') }}</span>
      </div>

      <div v-else class="notifications-list">
        <div
          v-for="notif in activeNotifications"
          :key="notif.id"
          class="notif-card"
          :class="{ unread: !isRead(notif.id) }"
          @click="openDetail(notif)"
        >
          <div class="notif-card-left">
            <div class="notif-card-dot" :class="`type-${notif.type || 'info'}`"></div>
          </div>
          <div class="notif-card-body">
            <div class="notif-card-header">
              <span class="notif-card-type-tag" :class="`type-${notif.type || 'info'}`">{{ typeLabel(notif.type) }}</span>
              <span class="notif-card-time">{{ relTime(notif.datetime || notif.date) }}</span>
            </div>
            <h3 class="notif-card-title">{{ getTitle(notif) }}</h3>
            <p class="notif-card-text">{{ getContent(notif) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
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
                <span v-if="isRead(selectedNotif.id)" class="notif-detail-read-tag">{{ t('notification.readTag') }}</span>
              </div>
              <div class="notif-detail-content">{{ getContent(selectedNotif) }}</div>

              <a
                v-if="selectedNotif.link && selectedNotif.linkText"
                :href="selectedNotif.link"
                :target="selectedNotif.link.startsWith('http') ? '_blank' : undefined"
                :rel="selectedNotif.link.startsWith('http') ? 'noopener' : undefined"
                class="notif-detail-link"
              >
                {{ getLinkText(selectedNotif) }} →
              </a>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFetchData } from '@/composables/useFetchData'
import { useNotificationReadState } from '@/composables/useNotificationReadState'
import { formatRelativeTime, formatFullDateTime } from '@/composables/useNotificationHelpers'

const { t, locale } = useI18n()

const { readIds, isRead, markAsRead } = useNotificationReadState()

const selectedNotif = ref(null)

const { data: notifData, loading, error } = useFetchData('/data/notification/notifications.json')

const activeNotifications = computed(() => {
  if (!notifData.value || !notifData.value.notifications) return []
  return [...notifData.value.notifications]
    .filter(n => n.active)
    .sort((a, b) => new Date(b.datetime || b.date) - new Date(a.datetime || a.date))
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

function openDetail(notif) {
  selectedNotif.value = notif
  markAsRead(notif.id)
}

function closeDetail() {
  selectedNotif.value = null
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

function handleEscape(e) {
  if (e.key === 'Escape' && selectedNotif.value) {
    closeDetail()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>
