import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { connectDB } from './config/db';
import { initWS } from './ws/wsManager';
import { startWorker } from './queues/worker';
import assignmentRoutes from './routes/assignment';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/assignments', assignmentRoutes);

initWS(wss);
startWorker();
connectDB();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));