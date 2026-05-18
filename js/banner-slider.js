/**
 * Banner轮播组件
 * 支持自动播放、手动切换、触摸滑动
 * 数据存储在 localStorage
 * 指示点颜色根据图片明暗自动切换
 */

class BannerSlider {
  constructor(options = {}) {
    this.container = options.container || '#banner-slider';
    this.autoPlay = options.autoPlay !== false;
    this.interval = options.interval || 5000;
    this.transitionDuration = options.transitionDuration || 500;
    this.brightnessThreshold = options.brightnessThreshold || 0.5; // 亮度阈值
    this.bannerVersion = '1.0.9.1'; // 版本号，更新后会自动清除旧数据
    
    this.currentIndex = 0;
    this.banners = [];
    this.timer = null;
    this.isHovered = false;
    this.imageBrightness = {}; // 存储每张图片的亮度
    
    // 隐藏的canvas用于提取像素
    this.canvas = null;
    this.ctx = null;
    
    this.init();
  }

  init() {
    this.loadBanners();
    this.initCanvas();
    this.render();
    this.bindEvents();
    if (this.autoPlay && this.banners.length > 1) {
      this.startAutoPlay();
    }
  }

  // 初始化隐藏的canvas
  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1;
    this.canvas.height = 1;
    this.canvas.style.display = 'none';
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    document.body.appendChild(this.canvas);
  }

  // 计算图片底部区域亮度
  calculateBrightness(img, callback) {
    const imgWidth = 50; // 采样宽度
    const imgHeight = 10; // 采样高度（底部区域）
    
    // 等待图片加载完成
    if (!img.complete) {
      img.addEventListener('load', () => this.calculateBrightness(img, callback));
      return;
    }
    
    // 如果图片尺寸为0，跳过
    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
      callback(1); // 默认浅色
      return;
    }
    
    // 设置canvas尺寸
    this.canvas.width = imgWidth;
    this.canvas.height = imgHeight;
    
    // 绘制图片底部区域
    const sourceY = img.naturalHeight - imgHeight;
    this.ctx.drawImage(
      img, 
      0, sourceY, img.naturalWidth, imgHeight, // 源图片区域
      0, 0, imgWidth, imgHeight // 目标canvas区域
    );
    
    // 获取像素数据
    const imageData = this.ctx.getImageData(0, 0, imgWidth, imgHeight);
    const data = imageData.data;
    
    let totalBrightness = 0;
    const pixelCount = imgWidth * imgHeight;
    
    for (let i = 0; i < data.length; i += 4) {
      // 计算亮度：使用相对亮度公式 (0.299*R + 0.587*G + 0.114*B) / 255
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      totalBrightness += brightness;
    }
    
    const avgBrightness = totalBrightness / pixelCount;
    callback(avgBrightness);
  }

  // 预加载所有图片并计算亮度
  preloadImages() {
    const activeBanners = this.banners.filter(b => b.active);
    const promises = activeBanners.map((banner, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          this.calculateBrightness(img, (brightness) => {
            this.imageBrightness[index] = brightness;
            resolve();
          });
        };
        img.onerror = () => {
          this.imageBrightness[index] = 1; // 默认浅色
          resolve();
        };
        img.src = banner.image;
      });
    });
    
    return Promise.all(promises);
  }

  // 加载Banner数据
  loadBanners() {
    const stored = localStorage.getItem('hcpgn-banners');
    const storedVersion = localStorage.getItem('hcpgn-banner-version');
    const defaults = this.getDefaultBanners();
    
    // 版本不一致时清除旧数据
    if (storedVersion !== this.bannerVersion) {
      localStorage.removeItem('hcpgn-banners');
      localStorage.setItem('hcpgn-banner-version', this.bannerVersion);
      this.banners = defaults;
      this.saveBanners();
      return;
    }
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // 合并默认数据，确保有 titleEn
        this.banners = parsed.map((banner, i) => ({
          ...defaults[i],
          ...banner
        }));
      } catch (e) {
        this.banners = defaults;
      }
    } else {
      this.banners = defaults;
      this.saveBanners();
    }
  }

  // 保存Banner数据
  saveBanners() {
    localStorage.setItem('hcpgn-banners', JSON.stringify(this.banners));
    window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: this.banners }));
  }

  // 默认Banner数据
  getDefaultBanners() {
    return [
      {
        id: 'banner_1',
        image: '/images/banner_1.png',
        title: '欢迎来到盒鸽 HcDove',
        titleEn: 'Welcome to HcDove',
        subtitle: '专注于游戏和科技的团队',
        subtitleEn: 'Focused on games and technology',
        link: '/',
        active: true
      }
    ];
  }
  
  // 获取当前语言对应的标题
  getTitle(banner) {
    const lang = localStorage.getItem('hcpgn-lang') || 'zh';
    return lang.startsWith('en') && banner.titleEn ? banner.titleEn : banner.title;
  }

  // 更新指示点颜色
  updateDotColors() {
    const container = document.querySelector(this.container);
    if (!container) return;
    
    const dots = container.querySelectorAll('.banner-dot');
    const activeBanners = this.banners.filter(b => b.active);
    
    dots.forEach((dot, index) => {
      const brightness = this.imageBrightness[index];
      
      if (brightness !== undefined) {
        // 根据亮度设置指示点颜色
        // 深色背景用浅色指示点，浅色背景用深色指示点
        if (brightness < this.brightnessThreshold) {
          // 深色背景：使用浅色指示点
          dot.style.background = 'rgba(255, 255, 255, 0.3)';
          dot.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        } else {
          // 浅色背景：使用深色指示点
          dot.style.background = 'rgba(0, 0, 0, 0.3)';
          dot.style.borderColor = 'rgba(0, 0, 0, 0.5)';
        }
        
        // 当前激活的指示点特殊处理
        if (index === this.currentIndex) {
          dot.style.transform = 'scale(1.2)';
          if (brightness < this.brightnessThreshold) {
            dot.style.background = '#fff';
          } else {
            dot.style.background = '#333';
          }
        }
      }
    });
  }

  // 渲染轮播组件
  render() {
    const container = document.querySelector(this.container);
    if (!container) return;

    const activeBanners = this.banners.filter(b => b.active);
    
    if (activeBanners.length === 0) {
      container.innerHTML = '<div class="banner-empty">暂无Banner</div>';
      return;
    }

    container.innerHTML = `
      <div class="banner-wrapper">
        <div class="banner-slides">
          ${activeBanners.map((banner, index) => `
            <div class="banner-slide ${index === 0 ? 'active' : ''}" data-index="${index}" data-link="${banner.link || '/'}" ${banner.title ? `title="${this.getTitle(banner)}"` : ''}>
              <img src="${banner.image}" alt="" class="banner-image" 
                   onerror="this.src='/images/logo.svg'">
            </div>
          `).join('')}
        </div>
        
        ${activeBanners.length >= 1 ? `
        <div class="banner-arrows">
          <button class="banner-prev" aria-label="上一张">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button class="banner-next" aria-label="下一张">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
        <div class="banner-dots">
          ${activeBanners.map((_, index) => `
            <button class="banner-dot ${index === 0 ? 'active' : ''}" 
                    data-index="${index}" aria-label="第${index + 1}张">
            </button>
          `).join('')}
        </div>
        ` : ''}
      </div>
    `;
  }
  
  // 更新语言后刷新banner标题
  updateLang() {
    const slides = document.querySelectorAll(`${this.container} .banner-slide`);
    const activeBanners = this.banners.filter(b => b.active);
    slides.forEach((slide, index) => {
      const banner = activeBanners[index];
      if (banner && banner.title) {
        slide.title = this.getTitle(banner);
      }
    });
  }

  // 绑定事件
  bindEvents() {
    const container = document.querySelector(this.container);
    if (!container) return;

    const wrapper = container.querySelector('.banner-wrapper');
    const prevBtn = container.querySelector('.banner-prev');
    const nextBtn = container.querySelector('.banner-next');
    const dots = container.querySelectorAll('.banner-dot');
    const slides = container.querySelectorAll('.banner-slide');

    // 上一张/下一张按钮
    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prev();
    });
    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });

    // 圆点导航
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.target.dataset.index);
        this.goTo(index);
      });
    });

    // 点击banner跳转
    slides.forEach(slide => {
      slide.addEventListener('click', (e) => {
        const link = slide.dataset.link;
        if (link) {
          window.location.href = link;
        }
      });
      slide.style.cursor = 'pointer';
    });

    // 左右区域悬停显示箭头
    wrapper?.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const halfWidth = rect.width / 2;
      if (prevBtn) prevBtn.style.opacity = x < halfWidth ? '1' : '0';
      if (nextBtn) nextBtn.style.opacity = x >= halfWidth ? '1' : '0';
    });

    wrapper?.addEventListener('mouseleave', () => {
      if (prevBtn) prevBtn.style.opacity = '0';
      if (nextBtn) nextBtn.style.opacity = '0';
    });

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) this.next();
        else this.prev();
      }
    }, { passive: true });

    // 键盘支持
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  // 切换到指定位置
  goTo(index) {
    const activeBanners = this.banners.filter(b => b.active);
    if (activeBanners.length <= 1) return;

    const slides = document.querySelectorAll(`${this.container} .banner-slide`);
    const dots = document.querySelectorAll(`${this.container} .banner-dot`);

    if (slides.length === 0) return;

    // 移除当前激活状态
    slides[this.currentIndex]?.classList.remove('active');
    dots[this.currentIndex]?.classList.remove('active');

    // 重置上一个指示点样式
    if (dots[this.currentIndex]) {
      dots[this.currentIndex].style.transform = '';
    }

    // 计算新索引（循环）
    this.currentIndex = (index + activeBanners.length) % activeBanners.length;

    // 添加新激活状态
    slides[this.currentIndex]?.classList.add('active');
    dots[this.currentIndex]?.classList.add('active');
  }

  prev() { this.goTo(this.currentIndex - 1); }
  next() { this.goTo(this.currentIndex + 1); }

  destroy() {
    const container = document.querySelector(this.container);
    if (container) container.innerHTML = '';
    if (this.canvas) this.canvas.remove();
  }
}

window.BannerSlider = BannerSlider;
