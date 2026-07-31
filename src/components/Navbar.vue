<template>
  <header class="navbar">
    <router-link to="/home" class="nav-item" @click="closeMenu">
      <img src="/images/logo.svg" alt="Logo" class="logo">
    </router-link>
    <button
      class="hamburger"
      :class="{ active: menuOpen }"
      aria-label="菜单"
      @click="toggleMenu"
    >
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
    <div class="nav-menu" :class="{ active: menuOpen }">
      <div class="nav-links">
        <a
          v-for="item in navItems"
          :key="item.key"
          href="#"
          class="nav-item"
          :class="{ active: currentRoute === item.key }"
          @click.prevent="navigateTo(item.key)"
        >
          {{ t(`nav.${item.key}`) }}
        </a>
      </div>
      <div class="nav-right">
        <NotificationCenter @navigate="closeMenu" />
        <div class="lang-switch" ref="langRef">
          <button
            class="lang-globe-btn"
            :class="{ active: langOpen }"
            :aria-label="t('common.selectLanguage')"
            @click="toggleLang"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- 语言选择弹窗 -->
  <Teleport to="body">
    <transition name="lang-dropdown">
      <div v-if="langOpen" class="lang-dropdown-overlay" @click.self="closeLang">
        <div class="lang-dropdown" ref="dropdownRef">
          <div class="lang-dropdown-header">{{ t('common.selectLanguage') }}</div>
          <button
            class="lang-option"
            :class="{ active: locale === 'zh' }"
            @click="switchLang('zh')"
          >
            <span class="lang-option-text">中文</span>
            <svg v-if="locale === 'zh'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
          <button
            class="lang-option"
            :class="{ active: locale === 'en' }"
            @click="switchLang('en')"
          >
            <span class="lang-option-text">English</span>
            <svg v-if="locale === 'en'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setLanguage } from '@/i18n'
import NotificationCenter from '@/components/NotificationCenter.vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const menuOpen = ref(false)
const langOpen = ref(false)
const langRef = ref(null)
const dropdownRef = ref(null)

const navItems = [
  { key: 'home' },
  { key: 'games' },
  { key: 'ai' },
  { key: 'about' }
]

const currentRoute = computed(() => {
  const name = route.name
  return name || 'home'
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function navigateTo(page) {
  closeMenu()
  router.push({ name: page })
}

function toggleLang() {
  langOpen.value = !langOpen.value
}

function closeLang() {
  langOpen.value = false
}

function switchLang(lang) {
  setLanguage(lang)
  closeLang()
  closeMenu()
}

// 任何路由跳转后收起展开的移动端菜单和弹窗
watch(() => route.fullPath, () => {
  menuOpen.value = false
  langOpen.value = false
})

function handleClickOutside(e) {
  // 汉堡菜单外部点击
  const hamburger = document.querySelector('.hamburger')
  const navMenu = document.querySelector('.nav-menu')
  if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    menuOpen.value = false
  }
  // 语言弹窗外部点击
  if (langOpen.value) {
    const globe = document.querySelector('.lang-globe-btn')
    const dropdown = dropdownRef.value
    if (globe && dropdown && !globe.contains(e.target) && !dropdown.contains(e.target)) {
      langOpen.value = false
    }
  }
}

function handleEscape(e) {
  if (e.key === 'Escape' && langOpen.value) {
    langOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>
