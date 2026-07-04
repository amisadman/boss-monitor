import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { seedDevices } from './database/seed';
import { initSocket } from './utils/socket';
import { startSimulator } from './modules/simulator/simulator.service';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedDevices();

    const server = http.createServer(app);

    initSocket(server);
    logger.info('Socket.io initialized successfully');

    await startSimulator();

    server.listen(PORT, () => {
      logger.info(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
