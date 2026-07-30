<template>
  <section class="page page-transition">
    <h1>{{ t('about.title') }}</h1>
    <p>{{ t('about.p1') }}</p>
    <p>{{ t('about.p2') }}</p>
    <p>{{ t('about.p3') }}</p>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
