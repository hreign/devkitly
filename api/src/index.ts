import 'dotenv/config';
import express from 'express';
import serverless from 'serverless-http';
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

// 鉴权
app.use('/api', authMiddleware);

// 路由
app.use('/api/qr', qrRouter);
app.use('/api/uuid', uuidRouter);
app.use('/api/password', passwordRouter);
app.use('/api/hash', hashRouter);
app.use('/api/codec', codecRouter);
app.use('/api/file-hash', fileHashRouter);
app.use('/api/token', tokenRouter);

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
