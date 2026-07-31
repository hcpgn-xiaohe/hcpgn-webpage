<template>
  <Navbar />
  <main class="content">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <div class="divider-1px"></div>
  <AppFooter />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>
