import Hapi from '@hapi/hapi';
import userRoutes from './routes/userRoutes.js';
import sequelize from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: 'localhost',
  });

  // Register user routes
  server.route(userRoutes);

  await sequelize.sync(); // Ensure that the database is in sync with the models

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
