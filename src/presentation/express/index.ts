import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { Server } from 'http';
import router from './routes';
import errorRequestHandler from './middlewares/errorHandler';
import envConf from '../../env.conf';

const app = express();

const PORT = envConf.PORT;

app.use(
    cors({
        origin: '*', //Manage cors as you want
    })
);

app.use(express.json());

app.use(morgan('dev')); // morgan for api route logging

const baseUrl = '/api/v1'; // change as you like

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
        console.info(`Server running on port http://localhost:${PORT}`);
    });

    return {
        server,
        app,
    };
}
