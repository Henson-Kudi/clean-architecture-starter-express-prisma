import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { Server } from 'http';
import router from './routes';
import errorRequestHandler from './middlewares/errorHandler';

const app = express();

// Use an env configuation file to define your port so that you have a single source for all your env configurations instead of using process.env everywhere
const PORT = process.env.PORT || 5000;

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