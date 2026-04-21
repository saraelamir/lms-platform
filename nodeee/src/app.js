import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: {}, message: 'Too many requests, please try again later.' },
});

app.use('/api', apiLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' }, message: 'Service healthy' });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
