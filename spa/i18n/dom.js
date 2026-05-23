/**
 * DOM 翻译更新器
 * 自动更新带有 data-i18n 属性的元素的文本内容
 */

import { onLangChange, getI18n } from './index.js';

/**
 * 初始化 DOM 翻译
 * 扫描所有带有 data-i18n 属性的元素并更新文本
 */
export function initDOMTranslation() {
  const i18n = getI18n();
  
  // 更新单个元素
  const updateElement = (el) => {
    const key = el.dataset.i18n;
    if (key) {
      el.textContent = i18n.t(key);
    }
  };

  // 更新所有元素
  const updateAll = () => {
    document.querySelectorAll('[data-i18n]').forEach(updateElement);
  };

  // 初次更新
  updateAll();

  // 监听语言变化
  onLangChange(() => {
    updateAll();
  });

  console.log('[i18n] DOM 翻译初始化完成');
}

// ========== Vue/React 集成示例 ==========

/**
 * Vue 3 插件
 * 使用方式：app.use(vueI18nPlugin)
 */
export const vueI18nPlugin = {
  install(app) {
    const i18n = getI18n();
    
    app.config.globalProperties.$t = (key, params) => i18n.t(key, params);
    app.config.globalProperties.$lang = i18n.getLang();
    
    app.provide('i18n', i18n);
  }
};

/**
 * React Hook
 * 使用方式：const { t, lang } = useI18n();
 */
export function useI18n() {
  const i18n = getI18n();
  return {
    t: (key, params) => i18n.t(key, params),
    lang: i18n.getLang(),
    setLang: (lang) => i18n.setLang(lang)
  };
}
