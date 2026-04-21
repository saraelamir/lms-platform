import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

async function start() {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
