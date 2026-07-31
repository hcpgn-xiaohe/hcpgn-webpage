<template>
  <footer class="footer">
    <div>{{ t('footer.contact') }}</div>
    <div class="social-icons">
      <a
        v-for="social in socials"
        :key="social.id"
        :href="social.link"
        :title="t(`social.${social.i18nKey}`)"
        :target="social.external ? '_blank' : undefined"
        :rel="social.external ? 'noopener' : undefined"
        class="social-icon-link"
        :class="{ 'qrcode-hover': social.qrcode }"
      >
        <img :src="`/images/social/${social.icon}`" :alt="t(`social.${social.i18nKey}`)" class="social-icon">
        <img :src="`/images/social/${social.iconHover}`" :alt="t(`social.${social.i18nKey}`)" class="social-icon social-icon-hover">
        <div v-if="social.qrcode" class="qrcode-popup">
          <img :src="`/images/social/${social.qrcode}`" :alt="t(`social.${social.i18nKey}`)">
        </div>
      </a>
    </div>
    <div class="font-credit">
      <span>{{ t('footer.font') }}</span>
      <a href="https://hyperos.mi.com/font/" target="_blank" rel="noopener">MiSans</a>
      <span>{{ t('footer.fontSuffix') }}</span>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const socials = [
  {
    id: 'bilibili',
    i18nKey: 'bilibili',
    icon: 'bilibili.png',
    iconHover: 'bilibili_color.png',
    link: 'https://space.bilibili.com/1016692202/',
    external: true
  },
  {
    id: 'douyin',
    i18nKey: 'douyin',
    icon: 'douyin.png',
    iconHover: 'douyin_color.png',
    link: 'https://www.douyin.com/user/MS4wLjABAAAAALiqkpu3Zp8I56vEpV46mEreYBIA2jFqRk-wSPZqOVbE/',
    external: true
  },
  {
    id: 'xiaohongshu',
    i18nKey: 'xiaohongshu',
    icon: 'xhs.png',
    iconHover: 'xhs_color.png',
    link: 'https://www.xiaohongshu.com/user/profile/60424623000000000100272f',
    external: true
  },
  {
    id: 'wechat',
    i18nKey: 'wechat',
    icon: 'gzh.png',
    iconHover: 'gzh_color.png',
    link: 'javascript:void(0)',
    qrcode: 'gzh_qrcode.png',
    external: false
  },
  {
    id: 'video',
    i18nKey: 'video',
    icon: 'sph.png',
    iconHover: 'sph_color.png',
    link: 'javascript:void(0)',
    qrcode: 'sph_qrcode.png',
    external: false
  },
  {
    id: 'makerworld',
    i18nKey: 'makerworld',
    icon: 'makerworld.png',
    iconHover: 'makerworld_color.png',
    link: 'https://makerworld.com.cn/@hcdove_01',
    external: true
  }
]
</script>
