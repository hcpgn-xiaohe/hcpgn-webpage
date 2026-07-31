<template>
  <section class="page page-transition">
    <h1>{{ t('ai.title') }}</h1>
    <!-- 加载中 -->
    <div v-if="loading" class="page-loading">
      <div class="page-spinner"></div>
    </div>
    <!-- 加载失败 -->
    <div v-else-if="error && allItems.length === 0" class="page-empty">
      <span>{{ t('ai.loadFailed') }}</span>
    </div>
    <!-- 正常展示 -->
    <template v-else>
      <div class="ai-categories" v-if="categories.length > 0">
        <template v-for="(cat, idx) in categories" :key="cat.key">
          <div class="ai-category">
            <h2>{{ getCategoryTitle(cat) }}</h2>
            <div class="games">
              <a
                v-for="item in cat.items"
                :key="item.id"
                :href="item.link"
                class="game"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener' : undefined"
              >
                <img :src="item.icon" :alt="getTitle(item)" class="game-icon">
                <div class="game-title">{{ getTitle(item) }}</div>
              </a>
            </div>
          </div>
          <div v-if="idx < categories.length - 1" class="ai-category-divider"></div>
        </template>
      </div>
      <div v-else class="page-empty">
        <span>{{ t('ai.comingSoon') }}</span>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFetchData } from '@/composables/useFetchData'

const { t, locale } = useI18n()

const { data: aiData, loading, error } = useFetchData('/data/ai/ai-items.json')

const categories = computed(() => {
  if (!aiData.value || !aiData.value.categories) return []
  return aiData.value.categories
})

const allItems = computed(() => {
  return categories.value.flatMap(cat => cat.items || [])
})

function getTitle(item) {
  return locale.value === 'en' && item.titleEn ? item.titleEn : item.title
}

function getCategoryTitle(cat) {
  return locale.value === 'en' && cat.titleEn ? cat.titleEn : cat.title
}
</script>
