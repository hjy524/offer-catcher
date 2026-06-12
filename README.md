# AI职配助手 - AI求职智能匹配平台

## 项目简介

面向在校大学生、应届生、实习求职群体的一站式AI求职成长平台，覆盖「职业迷茫疏导、无方向规划、简历智能优化、岗位精准匹配、个人求职沉淀、同龄人社区互助」全场景。

## 技术栈

- **前端框架**: Vue 3 + Vite
- **UI组件库**: Element Plus
- **路由**: Vue Router
- **数据库**: Supabase (免费版)
- **AI服务**: 硅基流动 API (deepseek-ai/DeepSeek-V4-Flash)
- **部署**: Cloudflare Pages

## 核心功能

1. **AI职业陪伴咨询**: 聊天式梳理职业方向，搭配第三方职业测评辅助定位
2. **简历全链路工具**: 简历上传解析、在线制作、JD定向诊断、AI智能优化、云端存档
3. **岗位智能匹配**: 基于简历/职业双画像，多维度精准匹配适配岗位
4. **个人心路沉淀**: Flomo式轻量化私密日志，记录求职全过程思绪与复盘
5. **求职社区互助**: 小红书式公开笔记社区，支持面经分享、经验交流、互动答疑

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
├── components/          # 通用组件
│   ├── NavHeader.vue    # 顶部导航
│   ├── Footer.vue       # 底部页脚
│   └── AIFloatButton.vue # 悬浮AI按钮
├── views/              # 页面视图
│   ├── Home.vue        # 首页
│   ├── Resume.vue      # 简历智能处理页
│   ├── JobMatch.vue    # 岗位智能匹配页
│   ├── ResumeCheck.vue # JD简历诊断优化页
│   ├── AIConsult.vue   # AI职业规划咨询页
│   ├── Journal.vue     # 求职心路日志页
│   ├── Community.vue   # 求职笔记社区页
│   ├── Article.vue     # 求职干货页
│   └── User.vue        # 个人中心页
├── stores/             # 状态管理
│   └── user.js         # 用户状态
├── utils/              # 工具函数
│   ├── supabase.js     # Supabase配置
│   ├── aiService.js    # AI服务封装
│   └── mockData.js     # 模拟数据
├── router/             # 路由配置
│   └── index.js
├── App.vue             # 根组件
├── main.js             # 入口文件
└── style.css           # 全局样式
```

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| / | 首页 | 平台入口，核心功能展示 |
| /resume | 简历智能处理 | 简历上传、在线制作、云端管理 |
| /job-match | 岗位智能匹配 | AI精准匹配适配岗位 |
| /resume-check | JD简历诊断 | 对标JD进行AI体检优化 |
| /ai-consult | AI职业咨询 | 智能引导对话规划职业 |
| /journal | 心路日志 | 私密求职感悟记录 |
| /community | 求职社区 | 公开笔记互助社区 |
| /article | 求职干货 | 聚合求职攻略内容 |
| /user | 个人中心 | 用户信息管理 |

## 登录体系

采用极简免密账号体系：
- 仅需用户名即可注册登录
- 无密码、无邮箱、无手机验证
- 后端强制校验用户名全局唯一
- 游客模式支持浏览公开内容

## 部署说明

### Cloudflare Pages 部署

1. 登录 Cloudflare 控制台
2. 创建新的 Pages 项目
3. 连接 GitHub 仓库
4. 配置构建命令：`npm run build`
5. 配置环境变量（Settings > Environment Variables）

### Supabase 配置

1. 创建 Supabase 项目
2. 创建必要的数据表：
   - users (用户表)
   - resumes (简历表)
   - journals (日志表)
   - community_notes (社区笔记表)
3. 获取 API URL 和 Anon Key

## 开发约束

- V1.0 不接入外部招聘平台，岗位仅供参考
- 私密日志与社区数据完全隔离
- 第三方测评仅外链跳转，无数据交互
- 全程采用免费资源部署

## 版本规划

- **V1.0**: 核心功能落地，纯参考型岗位池
- **V2.0**: 接入真实招聘数据源，个性化推送
- **V3.0**: 企业B端招聘后台，会员体系