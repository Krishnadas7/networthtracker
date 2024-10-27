import Hapi from '@hapi/hapi';
import userRoutes from './routes/userRoutes.js';
import sequelize from './config/database.js';
import dotenv from 'dotenv';
import rateLimiterPlugin from './config/rateLimit.js';

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: 'localhost',
  });

  await server.register({
    plugin: rateLimiterPlugin,
    options: {
      userLimit: 10, // Max requests per IP
      timeWindow: 10000, // Time window in milliseconds (e.g., 1 second)
    },
  });
  // Register user routes
  server.route(userRoutes);
  
  await sequelize.sync(); 

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
