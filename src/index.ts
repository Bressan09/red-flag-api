import restify from 'restify';
import socketio from 'socket.io';

/**
 *
 * @param req The request object
 * @param res The result object
 * @param next The function to be called next
 */
function helloWorld(
  req: restify.Request,
  res: restify.Response,
  next: restify.Next
) {
  res.send('hello world:' + req.params.name);
  next();
}

//Creates the server
const server = restify.createServer();

//Register a route on the server
server.get('/hello/:name', helloWorld);

//Create the socket object
const io = socketio(server.server, {
  //Additional options
  //perMessageDeflate: false
});

//Creates a new namespace
const chat = io.of('/chat');

//Register connection event on the namespace
chat.on('connection', (socket: socketio.Socket) => {
  console.log('a user connected');

  //Emit an event on the namespace
  chat.emit('userConnected', socket.id);

  //Register a disconnect event on the connected socket
  socket.on('disconnect', () => {
    console.log('user disconnected');
    chat.emit('userDisconnected', socket.id);
  });

  //Register an event on the socket
  socket.on('chatMessage', (msg) => {
    console.log('message: ' + msg);
    socket.broadcast.emit('chatMessage', { user: socket.id, body: msg });
  });
});

server.listen(3000, () => {
  console.log('%s listening at %s', server.name, server.url);
});
