import 'dotenv/config';
import express from 'express';
import serverless from 'serverless-http';
import { i18nMiddleware } from './middlewares/i18n.js';
import { authMiddleware } from './middlewares/auth.js';
import { errorHandler } from './middlewares/error-handler.js';
import qrRouter from './routes/qr.js';
import uuidRouter from './routes/uuid.js';
import passwordRouter from './routes/password.js';
import hashRouter from './routes/hash.js';
import codecRouter from './routes/codec.js';
import fileHashRouter from './routes/file-hash.js';
import tokenRouter from './routes/token.js';

const app = express();

// 中间件
app.use(express.json());

// 国际化（需在鉴权之前，确保鉴权错误消息也支持国际化）
app.use(i18nMiddleware);

// 鉴权
app.use(authMiddleware);

// 路由
app.use('/qr', qrRouter);
app.use('/uuid', uuidRouter);
app.use('/password', passwordRouter);
app.use('/hash', hashRouter);
app.use('/codec', codecRouter);
app.use('/file-hash', fileHashRouter);
app.use('/token', tokenRouter);

// 错误处理
app.use(errorHandler);

// Serverless 导出
export const handler = serverless(app);

// 本地开发启动
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production' || !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, () => {
    console.log(`API 服务已启动: http://localhost:${PORT}`);
  });
}
