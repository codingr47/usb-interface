import NetworkWebsockets from './model/NetworkWebsockets';
import WebSocketsRouter from '../common/routes/BaseWebsocketsRouter';
const router = new WebSocketsRouter();
const server:NetworkWebsockets = new NetworkWebsockets();
server.create(3000);

