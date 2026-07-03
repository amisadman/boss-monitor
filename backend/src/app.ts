import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { deviceRouter } from './modules/device/device.router';
import { alertRouter } from './modules/alert/alert.router';
import { usageRouter } from './modules/usage/usage.router';
import { sendResponse } from './utils/response';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing API endpoints
app.use('/api/devices', deviceRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/usage', usageRouter);

// Fallback Route for 404
app.use((req, res) => {
  sendResponse(res, 404, false, `Route ${req.originalUrl} not found`);
});

// Global Error Handler
app.use(errorHandler);

export default app;
