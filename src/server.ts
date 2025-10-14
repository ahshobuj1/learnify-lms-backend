/* eslint-disable no-console */
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string, {
      dbName: `${config.database_name}`,
    });

    server = app.listen(config.port, () => {
      console.log(
        `Example app listening on port http://localhost:${config.port}`,
      );
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.log(`detected unhandledRejection, shutting down...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on('uncaughtException', (err) => {
  console.log(`detected uncaughtException, shutting down...`, err);
  process.exit(1);
});
