/**
 * i18n 国际化模块
 * 负责动态加载语言文件并提供全局翻译接口
 */

import zh from './locales/zh.js';
import en from './locales/en.js';

// 语言文件注册表
const locales = { zh, en };

// 默认语言
const DEFAULT_LANG = 'zh';

/**
 * i18n 核心类
 */
class I18n {
  constructor() {
    this.currentLang = DEFAULT_LANG;
    this.translations = locales;
    this.listeners = [];
  }

  /**
   * 获取嵌套对象的值
   * @param {Object} obj - 目标对象
   * @param {string} path - 点分隔的路径，如 'nav.home'
   * @returns {*} 目标值
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  /**
   * 设置当前语言
   * @param {string} lang - 语言代码
   */
  setLang(lang) {
    if (!this.translations[lang]) {
      console.warn(`[i18n] 语言 '${lang}' 不存在，使用默认语言`);
      return;
    }
    this.currentLang = lang;
    this.notify();
  }

  /**
   * 获取当前语言
   * @returns {string}
   */
  getLang() {
    return this.currentLang;
  }

  /**
   * 翻译文本
   * @param {string} key - 翻译键名，如 'nav.home'
   * @param {Object} params - 替换参数，如 { name: 'John' }
   * @returns {string} 翻译后的文本
   */
  t(key, params = {}) {
    const translation = this.getNestedValue(this.translations[this.currentLang], key);
    
    if (translation === undefined) {
      console.warn(`[i18n] 键名 '${key}' 不存在`);
      return key;
    }

    // 处理参数替换，如 'Hello {name}' -> 'Hello John'
    return translation.replace(/\{(\w+)\}/g, (_, param) => {
      return params[param] !== undefined ? params[param] : `{${param}}`;
    });
  }

  /**
   * 获取所有可用语言
   * @returns {string[]}
   */
  getAvailableLangs() {
    return Object.keys(this.translations);
  }

  /**
   * 获取当前语言的全部翻译
   * @returns {Object}
   */
  getAll() {
    return this.translations[this.currentLang];
  }

  /**
   * 监听语言变化
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消监听函数
   */
  onChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * 通知所有监听器
   */
  notify() {
    this.listeners.forEach(callback => callback(this.currentLang));
  }
}

// 创建单例
const i18nInstance = new I18n();

// ========== 快捷函数 ==========

/**
 * 翻译函数
 * @param {string} key - 翻译键名
 * @param {Object} params - 替换参数
 * @returns {string}
 */
export function t(key, params) {
  return i18nInstance.t(key, params);
}

/**
 * 设置语言
 * @param {string} lang
 */
export function setLang(lang) {
  i18nInstance.setLang(lang);
}

/**
 * 获取当前语言
 * @returns {string}
 */
export function getLang() {
  return i18nInstance.getLang();
}

/**
 * 监听语言变化
 * @param {Function} callback
 */
export function onLangChange(callback) {
  return i18nInstance.onChange(callback);
}

/**
 * 获取 i18n 实例
 */
export function getI18n() {
  return i18nInstance;
}

// 默认导出实例
export default i18nInstance;
