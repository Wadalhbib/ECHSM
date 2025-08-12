import app from './app.js';
import { config } from './config/env.js';
import { initializeDatabase } from './config/database.js';

const startServer = async () => {
  try {
    // Test database connection
    await initializeDatabase();
    console.log('Database connection established');

    // Start server
    app.listen(config.port, '0.0.0.0', () => {
      console.log(`🚀 AI-OCHSMS Server running on port ${config.port}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      console.log(`🔗 API URL: http://localhost:${config.port}/api`);
      console.log(`❤️  Health check: http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();