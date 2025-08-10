import http from 'http';
import { Server as IOServer } from 'socket.io';
import { app } from './app.js';
import { getLogger } from './utils/logger.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const logger = getLogger('server');

const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean) || '*'
  }
});

io.on('connection', socket => {
  logger.info({ id: socket.id }, 'WebSocket client connected');
  socket.on('disconnect', () => logger.info({ id: socket.id }, 'WebSocket client disconnected'));
});

app.set('io', io);

server.listen(PORT, () => {
  logger.info(`Backend listening on port ${PORT}`);
});