import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

const browserLang = navigator.language.startsWith('en') ? 'en' : 'zh'
const savedLang = localStorage.getItem('hcpgn-lang') || browserLang

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'zh',
  messages: { zh, en }
})

// 同步语言到 localStorage 和 html lang 属性
export function setLanguage(lang) {
  i18n.global.locale.value = lang
  localStorage.setItem('hcpgn-lang', lang)
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en-US'

  // 更新 meta description
  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc) {
    metaDesc.content = i18n.global.t('meta.description')
  }

  // 更新页面标题
  const hash = window.location.hash
  const pageMatch = hash.match(/#\/?([a-z]+)/)
  const page = pageMatch ? pageMatch[1] : 'home'
  const titles = {
    zh: { home: '主页 - 盒鸽 HcDove', games: '游戏 - 盒鸽 HcDove', ai: 'AI - 盒鸽 HcDove', about: '关于 - 盒鸽 HcDove' },
    en: { home: 'Home - HcDove', games: 'Games - HcDove', ai: 'AI - HcDove', about: 'About - HcDove' }
  }
  document.title = (titles[lang] && titles[lang][page]) || titles[lang].home
}

// 初始化时设置 html lang
document.documentElement.lang = savedLang === 'zh' ? 'zh-CN' : 'en-US'

export default i18n
