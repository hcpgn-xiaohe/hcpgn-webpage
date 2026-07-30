# 盒鸽 HcDove 官网 (hcpgn-webpage)

盒鸽 HcDove 官方网站 —— 基于 **Vue 3 + Vite** 重构的静态站点，专注于游戏与科技。

This is the official website of HcDove, built with Vue 3 + Vite (static site).

## 技术栈 / Tech Stack

- Vue 3 (`<script setup>`)
- Vue Router 4（History 模式）
- vue-i18n 11（中文 / English）
- Vite 6

## 目录结构 / Structure

```
.
├── index.html              # 入口 HTML
├── vite.config.js          # Vite 配置（含 @ 别名、vendor 分包）
├── vercel.json             # Vercel 部署配置（构建 + SPA 重写）
├── public/                 # 静态资源（直接拷贝到 dist 根目录）
│   ├── images/             # Logo、社交图标
│   ├── fonts/              # MiSans 字体
│   ├── data/               # 后端 JSON 数据（banner/games/ai/notification）
│   ├── games/              # Godot 游戏（studytousegodot）
│   ├── zh-cn/ en-us/       # 旧路径重定向页
│   └── css/ js/            # Godot 游戏 / 人生清单所需
└── src/
    ├── main.js
    ├── App.vue
    ├── router/             # 路由（/home /games /ai /about /notifications）
    ├── i18n/               # 国际化
    ├── composables/        # 数据获取、通知已读状态等
    ├── components/         # Navbar / Footer / BannerSlider / NotificationCenter
    ├── pages/              # 各页面
    └── styles/main.css
```

## 本地开发 / Local Development

```bash
npm install
npm run dev        # 开发服务器 http://127.0.0.1:5173
npm run build      # 生产构建，输出到 dist/
npm run preview    # 本地预览构建产物
```

> 要求 Node >= 18.18（推荐 22）。仓库根目录已包含 `.nvmrc`。

## 部署到 Vercel / Deploy to Vercel

本项目已配置好 `vercel.json`，部署时无需额外设置：

1. 在 Vercel 中 **Import Git Repository**，选择本仓库。
2. Framework 会自动识别为 Vite，构建命令 `vite build`，输出目录 `dist`。
3. 部署完成后，所有前端路由（如 `/games`、`/ai`）通过 `vercel.json` 中的
   SPA 重写规则 fallback 到 `index.html`，而 `public/` 下的静态资源
   （图片、字体、Godot 游戏、JSON 数据）仍按原路径正常访问。
4. 后续推送代码到部署分支即可自动触发重新部署。

也可使用 Vercel CLI：

```bash
npm i -g vercel
vercel            # 预览部署
vercel --prod     # 生产部署
```

## 说明 / Notes

- 站点内容由 `public/data/*.json` 驱动，修改数据无需重新构建前端（仅更新 JSON 即可）。
- 通知公告的已读状态保存在浏览器 `localStorage`。
