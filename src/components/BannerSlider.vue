<template>
  <div id="banner-slider" ref="container">
    <!-- 加载中 -->
    <div v-if="loading" class="banner-loading">
      <div class="banner-spinner"></div>
    </div>
    <!-- 加载失败 -->
    <div v-else-if="error && activeBanners.length === 0" class="banner-empty">
      <span>{{ t('banner.loadFailed') }}</span>
    </div>
    <!-- 无数据 -->
    <div v-else-if="activeBanners.length === 0" class="banner-empty">
      <span>{{ t('banner.empty') }}</span>
    </div>
    <!-- 正常轮播 -->
    <div v-else class="banner-wrapper" ref="wrapper" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
      <div class="banner-slides">
        <div
          v-for="(banner, index) in activeBanners"
          :key="banner.id"
          class="banner-slide"
          :class="{ active: index === currentIndex }"
          :data-index="index"
          :data-link="banner.link || '/'"
          :title="getTitle(banner)"
          @click="onSlideClick(banner)"
          style="cursor: pointer;"
        >
          <img
            :src="banner.image"
            alt=""
            class="banner-image"
            @error="onImgError"
          >
        </div>
      </div>

      <div v-if="activeBanners.length >= 1" class="banner-arrows">
        <button class="banner-prev" aria-label="上一张" @click.stop="prev" :style="{ opacity: arrowOpacity.left }">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <button class="banner-next" aria-label="下一张" @click.stop="next" :style="{ opacity: arrowOpacity.right }">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>

      <div v-if="activeBanners.length >= 1" class="banner-dots" :class="{ hidden: !dotsVisible }">
        <button
          v-for="(banner, index) in activeBanners"
          :key="index"
          class="banner-dot"
          :class="{ active: index === currentIndex }"
          :style="getDotStyle(index)"
          :aria-label="`第${index + 1}张`"
          @click.stop="goTo(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFetchData } from '@/composables/useFetchData'

const { t, locale } = useI18n()

const props = defineProps({
  autoPlay: { type: Boolean, default: true },
  interval: { type: Number, default: 5000 }
})

const BRIGHTNESS_THRESHOLD = 0.5

const container = ref(null)
const wrapper = ref(null)
const currentIndex = ref(0)
const imageBrightness = reactive({})
const arrowOpacity = reactive({ left: '0', right: '0' })
const dotsVisible = ref(true)

let timer = null
let canvas = null
let ctx = null
let dotsTimer = null

// 后端数据获取
const { data: bannerData, loading, error, refresh } = useFetchData('/data/banner/banners.json')

const banners = computed(() => {
  if (!bannerData.value || !bannerData.value.banners) return []
  return bannerData.value.banners
})

const activeBanners = computed(() => banners.value.filter(b => b.active))

function getTitle(banner) {
  const isEn = locale.value === 'en'
  return isEn && banner.titleEn ? banner.titleEn : banner.title
}

function initCanvas() {
  canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  canvas.style.display = 'none'
  ctx = canvas.getContext('2d', { willReadFrequently: true })
  document.body.appendChild(canvas)
}

function calculateBrightness(img) {
  return new Promise((resolve) => {
    const imgWidth = 50
    const imgHeight = 10

    if (!img.complete) {
      img.addEventListener('load', () => resolve(calculateBrightnessSync(img, imgWidth, imgHeight)))
      return
    }

    resolve(calculateBrightnessSync(img, imgWidth, imgHeight))
  })
}

function calculateBrightnessSync(img, imgWidth, imgHeight) {
  if (img.naturalWidth === 0 || img.naturalHeight === 0) return 1

  canvas.width = imgWidth
  canvas.height = imgHeight
  const sourceY = img.naturalHeight - imgHeight
  ctx.drawImage(img, 0, sourceY, img.naturalWidth, imgHeight, 0, 0, imgWidth, imgHeight)

  const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight)
  const data = imageData.data
  let total = 0
  const count = imgWidth * imgHeight

  for (let i = 0; i < data.length; i += 4) {
    const brightness = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255
    total += brightness
  }

  return total / count
}

async function preloadImages() {
  const promises = activeBanners.value.map((banner, index) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = async () => {
        const brightness = await calculateBrightness(img)
        imageBrightness[index] = brightness
        resolve()
      }
      img.onerror = () => {
        imageBrightness[index] = 1
        resolve()
      }
      img.src = banner.image
    })
  })

  await Promise.all(promises)
}

function getDotStyle(index) {
  const brightness = imageBrightness[index]
  if (brightness === undefined) return {}

  if (brightness < BRIGHTNESS_THRESHOLD) {
    if (index === currentIndex.value) {
      return { transform: 'scale(1.2)', background: '#fff', borderColor: 'rgba(255,255,255,0.8)' }
    }
    return { background: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.5)' }
  } else {
    if (index === currentIndex.value) {
      return { transform: 'scale(1.2)', background: '#333', borderColor: 'rgba(0,0,0,0.5)' }
    }
    return { background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(0,0,0,0.5)' }
  }
}

function startAutoPlay() {
  stopAutoPlay()
  if (props.autoPlay && activeBanners.value.length > 1) {
    timer = setInterval(() => next(), props.interval)
  }
}

function stopAutoPlay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function showDots() {
  dotsVisible.value = true
  if (dotsTimer) clearTimeout(dotsTimer)
  dotsTimer = setTimeout(() => {
    dotsVisible.value = false
  }, 3000)
}

function goTo(index) {
  const len = activeBanners.value.length
  if (len <= 1) return
  currentIndex.value = (index + len) % len
  showDots()
}

function prev() { goTo(currentIndex.value - 1) }
function next() { goTo(currentIndex.value + 1) }

function onSlideClick(banner) {
  if (banner.link) {
    // 内部链接用 router 跳转，外部链接直接跳转
    if (banner.link.startsWith('/') || banner.link.startsWith('#')) {
      window.location.href = banner.link
    } else {
      window.open(banner.link, '_blank', 'noopener')
    }
  }
}

function onImgError(e) {
  e.target.src = '/images/logo.svg'
}

function onMouseMove(e) {
  if (!wrapper.value) return
  const rect = wrapper.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const halfWidth = rect.width / 2
  arrowOpacity.left = x < halfWidth ? '1' : '0'
  arrowOpacity.right = x >= halfWidth ? '1' : '0'
  showDots()
}

function onMouseLeave() {
  arrowOpacity.left = '0'
  arrowOpacity.right = '0'
}

let touchStartX = 0
function onTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX
}
function onTouchEnd(e) {
  const touchEndX = e.changedTouches[0].screenX
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0) next()
    else prev()
  }
}

function onKeydown(e) {
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

// 数据加载完成后初始化
watch(activeBanners, async (newBanners) => {
  if (newBanners.length > 0) {
    currentIndex.value = 0
    await preloadImages()
    startAutoPlay()
    showDots()
  }
})

onMounted(async () => {
  initCanvas()

  try {
    await refresh()
  } catch {
    // 错误已由 error ref 处理
  }

  if (container.value) {
    container.value.addEventListener('touchstart', onTouchStart, { passive: true })
    container.value.addEventListener('touchend', onTouchEnd, { passive: true })
  }
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  stopAutoPlay()
  if (dotsTimer) clearTimeout(dotsTimer)
  if (container.value) {
    container.value.removeEventListener('touchstart', onTouchStart)
    container.value.removeEventListener('touchend', onTouchEnd)
  }
  document.removeEventListener('keydown', onKeydown)
  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas)
  }
})
</script>
