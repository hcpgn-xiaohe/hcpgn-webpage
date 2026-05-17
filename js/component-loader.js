/**
 * 组件加载器 - 动态加载导航栏和底部组件
 */

const ComponentLoader = {
  /**
   * 异步加载 HTML 组件
   * @param {string} url - 组件文件路径
   * @returns {Promise<string>} - 返回 HTML 内容
   */
  async load(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`[ComponentLoader] 加载组件失败: ${url}`, error);
      return '';
    }
  },

  /**
   * 判断当前页面语言
   * @returns {string} - 'zh' 或 'en'
   */
  getLanguage() {
    const path = window.location.pathname;
    if (path.includes('/en-us/')) {
      return 'en';
    }
    return 'zh';
  },

  /**
   * 根据路径判断当前页面类型
   * @returns {string} - 'index', 'games', 'ai', 'about'
   */
  getPageType() {
    const path = window.location.pathname;
    if (path.includes('/games/')) {
      return 'games';
    } else if (path.includes('/ai/')) {
      return 'ai';
    } else if (path.includes('/about/')) {
      return 'about';
    }
    return 'index';
  },

  /**
   * 获取导航栏组件路径
   * @returns {string} - 导航栏组件 URL
   */
  getNavbarPath() {
    const lang = this.getLanguage();
    const pageType = this.getPageType();
    return `/components/navbar-${lang}-${pageType}.html`;
  },

  /**
   * 获取底部组件路径
   * @returns {string} - 底部组件 URL
   */
  getFooterPath() {
    const lang = this.getLanguage();
    return `/components/footer-${lang}.html`;
  },

  /**
   * 加载导航栏组件
   */
  async loadNavbar() {
    const navbarContainer = document.getElementById('navbar-placeholder');
    if (!navbarContainer) {
      console.warn('[ComponentLoader] 未找到导航栏占位符: #navbar-placeholder');
      return;
    }
    const path = this.getNavbarPath();
    const content = await this.load(path);
    navbarContainer.innerHTML = content;
    // 触发自定义事件，通知导航栏已加载
    document.dispatchEvent(new CustomEvent('navbarLoaded'));
  },

  /**
   * 加载底部组件
   */
  async loadFooter() {
    const footerContainer = document.getElementById('footer-placeholder');
    if (!footerContainer) {
      console.warn('[ComponentLoader] 未找到底部占位符: #footer-placeholder');
      return;
    }
    const path = this.getFooterPath();
    const content = await this.load(path);
    footerContainer.innerHTML = content;
    // 触发自定义事件，通知底部已加载
    document.dispatchEvent(new CustomEvent('footerLoaded'));
  },

  /**
   * 加载所有组件
   */
  async loadAll() {
    await Promise.all([this.loadNavbar(), this.loadFooter()]);
  }
};

// DOM 加载完成后自动加载组件
document.addEventListener('DOMContentLoaded', () => {
  ComponentLoader.loadAll();
});
