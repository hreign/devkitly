# DevKitly

DevKitly 是一个"开发者的在线工具箱"，基于 Web 的在线开发者工具集，提供 QR 码生成、UUID 生成、随机密码、文本散列、编码/解码、文件哈希、Token 生成等常用工具。项目采用 Monorepo 结构，分为 web（前端）和 api（后端）两个子项目，二者独立实现功能，前端不调用后端 API

[English](./README.en.md)

## 功能说明

| 功能 | 说明 |
|------|------|
| QR 码生成 | 支持文本和 Wi-Fi 两种类型，生成 Base64 PNG 图片 |
| UUID 生成 | 支持 v4（随机）和 v5（命名空间+名称），可批量生成 1-100 个 |
| 随机密码生成 | 长度 8-256 位，可自定义大小写、数字、符号及自定义符号集 |
| 文本散列 | 支持 MD5 和 SHA-256 算法 |
| 编码/解码 | 支持 Base64、Hex、UTF-8、Unicode、URL 五种格式互转 |
| 文件哈希 | 上传文件计算 MD5/SHA-256，最大支持 100MB，采用分片处理 |
| Token 生成 | 支持前缀、长度、数量配置，可批量生成 1-100 个 |

### 技术栈

- **前端**：Vue 3 + TypeScript + Vite + Naive UI + Pinia + vue-i18n
- **后端**：Express 5 + TypeScript + serverless-http
- **包管理**：pnpm（Monorepo 工作区）
- **加密/哈希**：crypto-js（前端）/ Node.js crypto（后端）
- **其他**：qrcode、uuid、spark-md5、highlight.js

## 部署说明

### 环境要求

- Node.js >= 22
- pnpm

### 本地开发部署

```bash
# 克隆仓库
git clone https://github.com/hreign/devkitly.git
cd devkitly

# 安装依赖
pnpm install

# 启动前端开发服务（默认端口 5173）
pnpm dev:web

# 启动后端开发服务（默认端口 3000）
pnpm dev:api

# 构建前端生产版本
pnpm build:web

# 构建后端生产版本
pnpm build:api
```

### Vercel 一键部署

[![部署到 Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hreign/devkitly&env=PASSWORD,VITE_BACKEND_URL)

点击上方按钮即可将项目快速部署到 Vercel 平台。项目采用 Monorepo 结构，部署时需注意：

- **前端（web）**：作为静态站点部署
- **后端（api）**：作为 Serverless Function 部署

### 环境变量

| 变量名 | 位置 | 说明 | 示例 |
|--------|------|------|------|
| `PASSWORD` | api | API 鉴权密码 | `your_password_here` |
| `PORT` | api | 服务端口，默认 3000 | `3000` |
| `VITE_BACKEND_URL` | web | 后端服务地址，设置后各功能页将显示 API 文档按钮 | `https://api.example.com` |

## 许可证

[MIT](./LICENSE)
