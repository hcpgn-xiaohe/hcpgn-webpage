/**
 * 语言检测与重定向模块
 * 根据浏览器语言自动跳转到对应语言版本页面
 */

// 获取浏览器语言，兼容不同浏览器
const getBrowserLanguage = () => {
  const lang = navigator.language || navigator.userLanguage;
  return lang.substring(0, 2).toLowerCase();
};

// 语言代码映射
const LANGUAGE_MAP = {
  zh: 'zh-cn',
  en: 'en-us'
};

// 获取目标语言目录
const getTargetLangDir = () => {
  const langCode = getBrowserLanguage();
  return LANGUAGE_MAP[langCode] || LANGUAGE_MAP.zh;
};

// 构建重定向路径
const buildRedirectPath = () => {
  const currentPath = window.location.pathname;
  const targetLang = getTargetLangDir();

  // 检查路径是否已包含语言标识
  const hasLangPrefix = /\/zh-cn\/|\/en-us\//.test(currentPath);

  if (hasLangPrefix) {
    // 替换现有语言前缀
    return currentPath.replace(/\/zh-cn\/|\/en-us\//, `/${targetLang}/`);
  }

  // 处理无语言前缀的路径
  if (currentPath === '/' || currentPath === '/index.html') {
    return `/${targetLang}/`;
  }

  if (currentPath.startsWith('/games/')) {
    return currentPath.replace('/games/', `/${targetLang}/games/`);
  }

  return `/${targetLang}/`;
};

// 执行重定向
const redirect = () => {
  const targetPath = buildRedirectPath();
  if (targetPath !== window.location.pathname) {
    window.location.href = targetPath;
  }
};

// 自动执行重定向
redirect();
