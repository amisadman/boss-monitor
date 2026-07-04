import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { deviceRouter } from './modules/device/device.router';
import { alertRouter } from './modules/alert/alert.router';
import { usageRouter } from './modules/usage/usage.router';
import { simulatorRouter } from './modules/simulator/simulator.router';
import { sendResponse } from './utils/response';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import os from 'os';

// Routing API endpoints
app.get('/', (req, res) => {
  const clientIP = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || req.ip || 'unknown';
  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);

  res.status(200).json({
    success: true,
    message: 'Welcome to Boss Monitor',
    version: '1.0.0',
    clientDetails: {
      clientIP,
      accessedAt: new Date().toISOString(),
    },
    serverDetails: {
      hostname: os.hostname(),
      platform: os.platform(),
      uptime: `${hours} hours ${minutes} minutes`,
    },
  });
});

app.use('/api/devices', deviceRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/usage', usageRouter);
app.use('/api/simulator', simulatorRouter);

// Fallback Route for 404
app.use((req, res) => {
  sendResponse(res, 404, false, `Route ${req.originalUrl} not found`);
});

// Global Error Handler
app.use(errorHandler);

export default app;
