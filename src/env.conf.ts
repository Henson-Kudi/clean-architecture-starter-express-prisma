// Inject all your environment variables here

import { NODE_ENV } from './domain/enums/nodeEnv';

/* eslint-disable no-process-env */
export default {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || NODE_ENV.DEVELOPMENT,
};
