<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="盒鸽 HcDove - 专注于游戏和科技的团队">
  <meta name="keywords" content="盒鸽,HcDove,游戏,科技,团队">
  <link rel="icon" href="/images/logo.svg" type="image/svg+xml" sizes="32x32">
  <link rel="stylesheet" href="/css/style.css?v=1.1.0">
  <title>盒鸽 HcDove</title>
</head>
<body>
  <!-- 导航栏 -->
  <header class="navbar">
    <a href="#" class="nav-item" data-page="home">
      <img src="/images/logo.svg" alt="Logo" class="logo">
    </a>
    <button class="hamburger" aria-label="菜单">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
    </button>
    <div class="nav-menu">
      <div class="nav-links">
        <a href="#" class="nav-item active" data-page="home" data-i18n="nav.home">主页</a>
        <a href="#" class="nav-item" data-page="games" data-i18n="nav.games">游戏</a>
        <a href="#" class="nav-item" data-page="ai" data-i18n="nav.ai">AI</a>
        <a href="#" class="nav-item" data-page="about" data-i18n="nav.about">关于</a>
      </div>
      <div class="lang-switch">
        <a href="#" class="lang-btn active" data-lang="zh">中</a>
        <span class="or1">|</span>
        <a href="#" class="lang-btn" data-lang="en">En</a>
      </div>
    </div>
  </header>

  <!-- 页面容器 -->
  <main id="app">
    <!-- 首页 -->
    <section id="page-home" class="page active">
      <h1 data-i18n="home.title">盒鸽 HcDove</h1>
      <p data-i18n="home.subtitle">专注于游戏和科技的团队</p>
      <p data-i18n="home.description">成立于2022年...</p>
    </section>

    <!-- 游戏页 -->
    <section id="page-games" class="page">
      <h1 data-i18n="games.title">游戏</h1>
      <p data-i18n="games.comingSoon">更多游戏敬请期待</p>
    </section>

    <!-- AI页 -->
    <section id="page-ai" class="page">
      <h1 data-i18n="ai.title">AI</h1>
      <p data-i18n="ai.description">AI智能体和工具</p>
    </section>

    <!-- 关于页 -->
    <section id="page-about" class="page">
      <h1 data-i18n="about.title">关于我们</h1>
      <p data-i18n="about.p1">盒鸽 HcDove成立于2022年...</p>
      <p data-i18n="about.p2">我们致力于...</p>
      <p data-i18n="about.p3">感谢您的支持！</p>
    </section>
  </main>

  <div class="divider-1px"></div>

  <!-- 底部 -->
  <footer class="footer">
    <div data-i18n="footer.contact">联系我们</div>
    <div class="social-icons">
      <a href="https://space.bilibili.com/1016692202/" title="Bilibili" target="_blank">
        <img src="/images/bilibili.png" alt="Bilibili" class="social-icon">
      </a>
      <a href="https://www.douyin.com/user/MS4wLjABAAAAA..." title="Douyin" target="_blank">
        <img src="/images/douyin.png" alt="Douyin" class="social-icon">
      </a>
    </div>
    <div class="font-credit">
      <span data-i18n="footer.font">本网站使用</span>
      <a href="https://hyperos.mi.com/font/" target="_blank">MiSans</a>
      <span data-i18n="footer.fontSuffix">字体</span>
    </div>
  </footer>

  <!-- i18n 模块 -->
  <script type="module">
    /**
     * 多语言 SPA 应用
     * 使用独立的 i18n 模块进行国际化
     */
    
    // ========== 语言数据 ==========
    const locales = {
      zh: {
        nav: { home: '主页', games: '游戏', ai: 'AI', about: '关于' },
        home: { title: '盒鸽 HcDove', subtitle: '专注于游戏和科技的团队', description: '成立于2022年，致力于为用户带来优质的游戏体验和科技产品' },
        games: { title: '游戏', comingSoon: '更多游戏敬请期待' },
        ai: { title: 'AI', description: 'AI智能体和工具' },
        about: { title: '关于我们', p1: '盒鸽 HcDove成立于2022年，是一个专注于游戏和科技的团队。', p2: '我们致力于通过技术创新，为用户带来优质的游戏体验和科技产品。', p3: '感谢您对盒鸽 HcDove的支持与关注！' },
        footer: { contact: '联系我们', font: '本网站使用', fontSuffix: '字体' }
      },
      en: {
        nav: { home: 'Home', games: 'Games', ai: 'AI', about: 'About' },
        home: { title: 'HcDove', subtitle: 'Focused on games and technology', description: 'Founded in 2022, dedicated to bringing high-quality gaming experiences and technology products' },
        games: { title: 'Games', comingSoon: 'More games coming soon' },
        ai: { title: 'AI', description: 'AI Agents and tools' },
        about: { title: 'About Us', p1: 'HcDove was founded in 2022, focusing on games and technology.', p2: 'We are committed to bringing high-quality gaming experiences and technology products.', p3: 'Thank you for your support and attention to HcDove!' },
        footer: { contact: 'Contact Us', font: 'This website uses', fontSuffix: 'font' }
      }
    };

    // ========== i18n 核心 ==========
    class I18n {
      constructor() {
        this.currentLang = localStorage.getItem('hcpgn-lang') || 'zh';
        this.translations = locales;
        this.listeners = [];
      }

      getNestedValue(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
      }

      t(key) {
        const val = this.getNestedValue(this.translations[this.currentLang], key);
        return val !== undefined ? val : key;
      }

      setLang(lang) {
        if (!this.translations[lang]) return;
        this.currentLang = lang;
        localStorage.setItem('hcpgn-lang', lang);
        this.updateDOM();
        this.listeners.forEach(fn => fn(lang));
      }

      getLang() { return this.currentLang; }

      onChange(fn) { this.listeners.push(fn); }

      updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.dataset.i18n;
          if (key) el.textContent = this.t(key);
        });
      }
    }

    const i18n = new I18n();

    // ========== SPA 应用 ==========
    const App = {
      state: { currentPage: 'home' },

      init() {
        // 初始化语言
        const browserLang = navigator.language.startsWith('en') ? 'en' : 'zh';
        const savedLang = localStorage.getItem('hcpgn-lang') || browserLang;
        i18n.setLang(savedLang);

        // 更新语言按钮状态
        this.updateLangButtons();

        // 绑定事件
        this.bindEvents();
      },

      bindEvents() {
        // 语言切换
        document.querySelectorAll('.lang-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            i18n.setLang(e.target.dataset.lang);
            this.updateLangButtons();
          });
        });

        // 导航切换
        document.querySelectorAll('[data-page]').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo(e.target.dataset.page || e.target.closest('[data-page]')?.dataset.page);
          });
        });

        // 汉堡菜单
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger?.addEventListener('click', () => {
          hamburger.classList.toggle('active');
          navMenu.classList.toggle('active');
        });
      },

      updateLangButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.lang === i18n.getLang());
        });
        document.documentElement.lang = i18n.getLang() === 'zh' ? 'zh-CN' : 'en-US';
      },

      navigateTo(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${page}`)?.classList.add('active');
        document.querySelectorAll('[data-page]').forEach(link => {
          link.classList.toggle('active', link.dataset.page === page);
        });
        this.state.currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // 启动
    document.addEventListener('DOMContentLoaded', () => App.init());
  </script>
</body>
</html>
