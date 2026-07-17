# DevKitly

DevKitly is an “online toolkit for developers”—a web-based collection of developer tools that provides commonly used utilities such as QR code generation, UUID generation, random password generation, text hashing, encoding/decoding, file hashing, and token generation. The project uses a monorepo structure and is divided into two subprojects: web (frontend) and api (backend). Each implements its own functionality independently, and the frontend does not call the backend API.

[中文](./README.md)

## Features

| Feature | Description |
|---------|-------------|
| QR Code Generator | Supports text and Wi-Fi types, generates Base64 PNG images |
| UUID Generator | Supports v4 (random) and v5 (namespace+name), batch generate 1-100 |
| Random Password Generator | Length 8-256, customizable uppercase/lowercase, digits, symbols, and custom symbol set |
| Text Hash | Supports MD5 and SHA-256 algorithms |
| Encode/Decode | Supports Base64, Hex, UTF-8, Unicode, URL format conversion |
| File Hash | Upload files to calculate MD5/SHA-256, max 100MB, chunked processing |
| Token Generator | Supports prefix, length, quantity configuration, batch generate 1-100 |

### Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite + Naive UI + Pinia + vue-i18n
- **Backend**: Express 5 + TypeScript + serverless-http
- **Package Manager**: pnpm (Monorepo workspace)
- **Crypto/Hash**: crypto-js (frontend) / Node.js crypto (backend)
- **Others**: qrcode, uuid, spark-md5, highlight.js

## Deployment

### Prerequisites

- Node.js >= 22
- pnpm

### Local Development

```bash
# Clone the repository
git clone https://github.com/hreign/devkitly.git
cd devkitly

# Install dependencies
pnpm install

# Start frontend dev server (default port 5173)
pnpm dev:web

# Start backend dev server (default port 3000)
pnpm dev:api

# Build frontend for production
pnpm build:web

# Build backend for production
pnpm build:api
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hreign/devkitly&env=PASSWORD,VITE_BACKEND_URL)

Click the button above to quickly deploy the project to Vercel. The project uses a Monorepo structure, note the following when deploying:

- **Frontend (web)**: Deploy as a static site
- **Backend (api)**: Deploy as a Serverless Function

### Environment Variables

| Variable | Location | Description | Example |
|----------|----------|-------------|---------|
| `PASSWORD` | api | API authentication password | `your_password_here` |
| `PORT` | api | Server port, default 3000 | `3000` |
| `VITE_BACKEND_URL` | web | Backend service URL, when set, API doc buttons will appear on feature pages | `https://api.example.com` |

## License

[MIT](./LICENSE)
