<template>
  <section class="page page-transition">
    <h1>{{ t('games.title') }}</h1>
    <!-- 加载中 -->
    <div v-if="loading" class="page-loading">
      <div class="page-spinner"></div>
    </div>
    <!-- 加载失败 -->
    <div v-else-if="error && allGames.length === 0" class="page-empty">
      <span>{{ t('games.loadFailed') }}</span>
    </div>
    <!-- 正常展示 -->
    <template v-else>
      <div
        v-for="cat in categories"
        :key="cat.key"
      >
        <div class="games">
            <a
            v-for="game in cat.items"
            :key="game.id"
            :href="getLink(game)"
            class="game"
            :target="game.external ? '_blank' : undefined"
            :rel="game.external ? 'noopener' : undefined"
          >
            <img :src="game.icon" :alt="getTitle(game)" class="game-icon">
            <div class="game-title">{{ getTitle(game) }}</div>
          </a>
        </div>
      </div>
      <div v-if="allGames.length === 0" class="page-empty">
        <span>{{ t('games.comingSoon') }}</span>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFetchData } from '@/composables/useFetchData'

const { t, locale } = useI18n()

const { data: gamesData, loading, error } = useFetchData('/data/games/games.json')

const categories = computed(() => {
  if (!gamesData.value || !gamesData.value.categories) return []
  return gamesData.value.categories
})

const allGames = computed(() => {
  return categories.value.flatMap(cat => cat.items || [])
})

function getTitle(item) {
  return locale.value === 'en' && item.titleEn ? item.titleEn : item.title
}

function getLink(item) {
  return locale.value === 'en' && item.linkEn ? item.linkEn : item.link
}
</script>
