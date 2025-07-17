import { Server } from 'node:http';
import { parse } from 'node:url';
import next from 'next';
import { setHttpServer, setWebSocketServer } from 'next-ws/server';
import { WebSocketServer } from 'ws';

const httpServer = new Server();
setHttpServer(httpServer);
const webSocketServer = new WebSocketServer({ noServer: true });
setWebSocketServer(webSocketServer);

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, customServer: true, turbo: true, turbopack: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  httpServer
    .on('request', async (req, res) => {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    })
    .listen(3000, () => {
      console.log("▲ Ready on http://localhost:3000");
    });
});