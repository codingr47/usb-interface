import NetworkWebsockets from './model/NetworkWebsockets';
import WebSocketsRouter from '../common/routes/BaseWebsocketsRouter';
const router = new WebSocketsRouter();
//console.log(router.getRoutes());
const server:NetworkWebsockets = new NetworkWebsockets();
server.create(3000);
server.middlewares();
