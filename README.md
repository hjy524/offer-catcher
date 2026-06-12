# Offer捕手 - AI求职智能匹配平台

## 项目简介

面向在校大学生、应届生、实习求职群体的一站式AI求职成长平台，覆盖「职业迷茫疏导、简历智能优化、岗位精准匹配、个人求职沉淀、同龄人社区互助」全场景。

## 技术栈

- **前端框架**: Vue 3 + Vite 5
- **UI组件库**: Element Plus
- **路由**: Vue Router (History 模式)
- **数据库**: Supabase PostgreSQL（云端存储，内存缓存读写）
- **AI服务**: 硅基流动 API (DeepSeek-V4-Flash)
- **部署**: Vercel（海外）/ Cloudflare Pages（国内）

## 核心功能

1. **AI职业陪伴咨询**: 聊天式梳理职业方向，搭配第三方职业测评辅助定位
2. **简历全链路工具**: 简历上传解析、在线制作、JD定向诊断、AI智能优化
3. **岗位智能匹配**: 基于简历多维度精准匹配适配岗位（30+模拟岗位）
4. **个人心路沉淀**: Flomo式轻量化私密日志，日历看板回顾，AI洞察分析
5. **求职社区互助**: 公开笔记社区，支持面经分享、点赞评论、分类检索
6. **个人中心**: 简历管理、收藏台账、诊断历史、AI对话记录、数据导出

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写配置：

```bash
cp .env.example .env.local
```

- `VITE_SUPABASE_URL` — Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon 公钥
- `VITE_AI_API_KEY` — AI 服务 API Key
- `VITE_AI_API_URL` — AI 服务接口地址
- `VITE_AI_MODEL` — AI 模型名称

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── components/            # 通用组件
│   ├── NavHeader.vue     # 顶部导航
│   ├── Footer.vue        # 底部页脚（含使用指南/隐私政策弹窗）
│   └── AIFloatButton.vue # 悬浮AI按钮
├── views/                # 页面视图
│   ├── Home.vue          # 首页
│   ├── Resume.vue        # 简历智能处理（上传解析/在线制作/管理）
│   ├── JobMatch.vue      # 岗位智能匹配（多维度筛选/收藏）
│   ├── ResumeCheck.vue   # JD简历诊断优化
│   ├── AIConsult.vue     # AI职业规划咨询
│   ├── Journal.vue       # 求职心路日志（标签/日历/AI洞察）
│   ├── Community.vue     # 求职笔记社区（分类/发布/互动）
│   ├── Article.vue       # 求职干货
│   ├── User.vue          # 个人中心（简历/收藏/日志/笔记/设置）
│   ├── NoteDetail.vue    # 笔记详情（个人模式含侧边栏筛选）
│   ├── ChatHistory.vue   # AI对话记录详情页
│   └── DiagnoseDetail.vue # 诊断报告详情页
├── stores/               # 状态管理
│   └── user.js           # 用户状态 + 数据读写（localStorage + Supabase 双写）
├── utils/                # 工具函数
│   ├── supabase.js       # Supabase 客户端初始化
│   ├── supabaseStorage.js # Supabase 云端存储封装
│   ├── aiService.js      # AI 服务封装（支持多供应商切换）
│   ├── crypto.js         # 密码哈希工具
│   ├── markdown.js       # Markdown 渲染
│   └── mockData.js       # 模拟数据（岗位/文章/测评链接）
├── router/               # 路由配置
│   └── index.js
├── App.vue               # 根组件
├── main.js               # 入口文件
└── style.css             # 全局样式
```

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 平台入口，核心功能展示 |
| `/resume` | 简历智能处理 | 上传解析、在线制作、多版本管理 |
| `/job-match` | 岗位智能匹配 | AI精准匹配，城市/类型/公司筛选 |
| `/resume-check` | JD简历诊断 | 对标JD进行AI体检，逐项优化建议 |
| `/ai-consult` | AI职业咨询 | 智能对话，职业标签看板，测评链接 |
| `/journal` | 心路日志 | 私密记录，标签管理，日历看板，AI洞察 |
| `/community` | 求职社区 | 公开笔记，分类检索，发布互动 |
| `/article` | 求职干货 | 求职攻略聚合 |
| `/user` | 个人中心 | 简历/收藏/日志/笔记管理，设置 |
| `/note/:id` | 笔记详情 | 个人模式(侧边栏) / 公共模式(简洁) |
| `/chat-history` | 对话记录 | AI对话历史全文浏览 |
| `/diagnose-detail/:index` | 诊断报告 | 诊断报告完整详情 |

## 数据架构

### 存储方案（纯云端 + 内存缓存）

```
写入 → 内存缓存（即时响应） → Supabase（500ms 内持久化）
读取 ← 内存缓存（毫秒级响应） ← Supabase（登录时全量加载）
```

所有用户数据存储在 Supabase 云端，前端使用内存缓存实现秒级读写，不依赖 localStorage。换浏览器或设备登录同一账号，数据自动同步。

### Supabase 数据表

| 表名 | 用途 | 关键字段 |
|------|------|----------|
| `auth_users` | 用户认证 | username(PK), user_id, password_hash |
| `user_data` | 用户数据存储 | user_id(PK), username, data(JSONB) |
| `community_notes` | 社区笔记 | id(PK), author, title, content, likes, comments |

### 登录体系

采用极简免密账号体系：
- 仅需用户名即可注册登录
- 密码 SHA-256 哈希加密存储
- 注册时校验用户名全局唯一（本地 + Supabase）

## 部署说明

### Vercel 部署（推荐，自动部署）

1. Fork 或推送代码到 GitHub 仓库
2. 登录 [Vercel](https://vercel.com) 导入仓库
3. 框架自动识别为 Vite
4. 部署完成自动生成 `https://xxx.vercel.app`

### Cloudflare Pages 部署（国内访问快）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pages → Create a project → Connect to Git
3. 构建命令：`npm run build`，输出目录：`dist`
4. 部署完成自动生成 `https://xxx.pages.dev`

### 环境变量配置

在部署平台配置以下环境变量：

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL | Supabase Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon 公钥 | 同上 |
| `VITE_AI_API_KEY` | 硅基流动 API Key | [siliconflow.cn](https://siliconflow.cn) |
| `VITE_AI_API_URL` | AI 服务地址 | `https://api.siliconflow.cn/v1/chat/completions` |
| `VITE_AI_MODEL` | AI 模型 | `deepseek-ai/DeepSeek-V4-Flash` |

## 版本记录

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0 | 2026-06 | 完整功能版：AI咨询/简历/匹配/诊断/日志/社区/个人中心 |
| v1.0.1 | 2026-06 | 新增笔记详情页+侧边栏筛选、AI对话记录页、诊断报告详情页 |
| v1.0.2 | 2026-06 | 接入 Supabase 云端数据库、数据持久化、代码结构优化 |

## 开发约束

- 岗位数据为模拟参考，不接入外部招聘平台
- 私密日志与社区数据完全隔离
- 第三方测评仅外链跳转，无数据交互
- 全程采用免费资源部署
