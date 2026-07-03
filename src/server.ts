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
    // 1. Connect to Database
    await connectDB();

    // 2. Seed initial devices if empty
    await seedDevices();

    // 3. Create HTTP Server
    const server = http.createServer(app);

    // 4. Initialize Socket.io
    initSocket(server);
    logger.info('Socket.io initialized successfully');

    // 5. Start Simulator Service
    startSimulator();

    // 6. Listen on PORT
    server.listen(PORT, () => {
      logger.info(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
