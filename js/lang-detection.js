// 获取浏览器语言（兼容不同浏览器）
const lang = navigator.language || navigator.userLanguage;
// 提取语言代码前两位（如en/zh）
const langCode = lang.substring(0, 2).toLowerCase();

// 检测语言并跳转到对应页面
if (langCode === "zh") {
  window.location.href = "/zh-cn/"; // 中文用户跳转
} else if (langCode === "en") {
  window.location.href = "/en-us/"; // 英文用户跳转
} else {
  window.location.href = "/zh-cn/"; // 其他语言默认跳转到中文页面
}
