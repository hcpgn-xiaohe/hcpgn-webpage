// 获取浏览器语言（兼容不同浏览器）
const lang = navigator.language || navigator.userLanguage;
// 提取语言代码前两位（如en/zh）
const langCode = lang.substring(0, 2).toLowerCase();

// 获取当前页面路径
const currentPath = window.location.pathname;

// 构建目标语言的路径
function buildTargetPath() {
  // 检查当前路径是否已经包含语言标识
  if (currentPath.includes('/zh-cn/') || currentPath.includes('/en-us/')) {
    // 如果已经包含语言标识，根据用户语言替换
    if (langCode === 'zh') {
      return currentPath.replace('/en-us/', '/zh-cn/');
    } else if (langCode === 'en') {
      return currentPath.replace('/zh-cn/', '/en-us/');
    } else {
      // 其他语言默认使用中文
      return currentPath.replace('/en-us/', '/zh-cn/');
    }
  } else {
    // 如果当前路径不包含语言标识，根据用户语言添加
    if (langCode === 'zh') {
      // 根目录或其他路径，跳转到中文首页
      if (currentPath === '/' || currentPath === '/index.html') {
        return '/zh-cn/index.html';
      } else if (currentPath.startsWith('/games/')) {
        return currentPath.replace('/games/', '/zh-cn/games/');
      } else {
        return '/zh-cn/index.html';
      }
    } else if (langCode === 'en') {
      // 根目录或其他路径，跳转到英文首页
      if (currentPath === '/' || currentPath === '/index.html') {
        return '/en-us/index.html';
      } else if (currentPath.startsWith('/games/')) {
        return currentPath.replace('/games/', '/en-us/games/');
      } else {
        return '/en-us/index.html';
      }
    } else {
      // 其他语言默认使用中文
      if (currentPath === '/' || currentPath === '/index.html') {
        return '/zh-cn/index.html';
      } else if (currentPath.startsWith('/games/')) {
        return currentPath.replace('/games/', '/zh-cn/games/');
      } else {
        return '/zh-cn/index.html';
      }
    }
  }
}

// 执行跳转
const targetPath = buildTargetPath();
if (targetPath !== currentPath) {
  window.location.href = targetPath;
}
