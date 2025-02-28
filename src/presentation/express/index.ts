import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Server } from 'http';
import router from './routes';
import errorRequestHandler from './middlewares/errorHandler';
import envConf from '../../env.conf';
import { NODE_ENV } from '../../domain/enums/nodeEnv';
import logger from '../../utils/logger';

const app = express();

const PORT = envConf.PORT;

app.use(
  cors({
    origin: (req, cb) => {
      cb(null, true);
    }, //Manage cors as you want
  })
);

app.use(express.json());

// Add morgan for dev api route logging only
if (envConf.NODE_ENV !== NODE_ENV.PRODUCTION) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.use(require('morgan')('dev')); // morgan for api route logging
}

const baseUrl = '/api/v1/discounts-service'; // change as you like

//
app.use(`${baseUrl}`, router);

// Attach error handler only attach all other route handlers
app.use(errorRequestHandler);

export default function startExpressServer(): {
  server: Server;
  app: express.Application;
} {
  const server = app.listen(PORT, () => {
    // Better to use a logger instead of just logging to console
    logger.info(`Server running on port http://localhost:${PORT}`);
  });

  return {
    server,
    app,
  };
}
