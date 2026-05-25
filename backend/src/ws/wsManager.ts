import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';

const clients = new Map<string, WebSocket>();

export const initWS = (wss: WebSocketServer) => {
  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const id = req.url?.split('?id=')[1];
    if (id) {
      clients.set(id, ws);
      console.log(`WS client connected: ${id}`);
    }

    ws.on('close', () => {
      if (id) clients.delete(id);
    });
  });
};

export const notifyClient = (assignmentId: string, payload: object) => {
  const ws = clients.get(assignmentId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
};