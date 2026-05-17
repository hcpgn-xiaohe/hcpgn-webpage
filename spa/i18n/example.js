/**
 * 使用示例
 * 
 * 本模块展示了 i18n 系统的各种用法
 */

import { t, setLang, getLang, onLangChange, getI18n } from './index.js';

// ========== 基础用法 ==========

// 直接翻译
console.log(t('nav.home'));        // 输出: 主页 / Home
console.log(t('home.title'));       // 输出: 盒鸽 HcDove / HcDove
console.log(t('footer.contact'));   // 输出: 联系我们 / Contact Us

// 带参数的翻译
// 在翻译文件中：{ greeting: '你好 {name}!' }
// t('greeting', { name: '小明' })  // 输出: 你好 小明!

// ========== 语言切换 ==========

// 设置语言
setLang('zh');  // 切换到中文
setLang('en');  // 切换到英文

// 获取当前语言
console.log(getLang());  // 输出: en

// ========== 监听变化 ==========

// 监听语言变化
const unsubscribe = onLangChange((lang) => {
  console.log('语言已切换至:', lang);
  // 可以在这里更新 UI、重新渲染组件等
});

// 取消监听
unsubscribe();

// ========== 访问实例 ==========

const i18n = getI18n();

// 获取所有可用语言
console.log(i18n.getAvailableLangs());  // ['zh', 'en']

// 获取当前语言全部翻译
const translations = i18n.getAll();
console.log(translations.nav.home);

// ========== DOM 更新示例 ==========

/*
HTML:
<div data-i18n="home.title">盒鸽 HcDove</div>
<button data-i18n="common.close">关闭</button>

JavaScript:
import { initDOMTranslation } from './dom.js';
initDOMTranslation();  // 自动更新所有 data-i18n 元素的文本
*/

// ========== Vue 3 示例 ==========

/*
import { createApp } from 'vue';
import { vueI18nPlugin } from './dom.js';

const app = createApp(App);
app.use(vueI18nPlugin);

// 在组件中
export default {
  computed: {
    title() {
      return this.$t('home.title');
    }
  }
};
*/

// ========== React 示例 ==========

/*
import { useI18n } from './dom.js';

function Navbar() {
  const { t, lang, setLang } = useI18n();
  
  return (
    <nav>
      <a href="#">{t('nav.home')}</a>
      <button onClick={() => setLang('en')}>EN</button>
    </nav>
  );
}
*/
