import restify from 'restify';
import socketio from 'socket.io';
import routes from './routes';
import { authenticated, logger } from './middlewares';
import { API_PORT } from './env';

import { chat } from './chat';

//Creates the server
const server = restify.createServer();

server.use(authenticated);

routes(server);

const io = socketio(server.server, {});

chat(io);

server.listen(API_PORT, () => {
  logger.warn(`${server.name} listening at ${server.url}`);
});
