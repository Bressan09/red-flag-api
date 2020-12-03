"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var restify_1 = __importDefault(require("restify"));
var socket_io_1 = __importDefault(require("socket.io"));
function respond(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
}
var server = restify_1.default.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
var io = socket_io_1.default(server.server, {
    perMessageDeflate: false
});
var chat = io.of('/chat');
chat.on('connection', function (socket) {
    console.log('Connect Chat');
});
chat.on('connection', function (socket) {
    console.log('a user connected');
    chat.emit('userConnected', socket.id);
    socket.on('disconnect', function () {
        chat.emit('userDisconnected', socket.id);
        console.log('user disconnected');
    });
    /*
    socket.on('chatMessage', (msg) => {
      console.log('message: ' + msg);
    });*/
    socket.on('chatMessage', function (msg) {
        console.log('message: ' + msg);
        socket.broadcast.emit('chatMessage', msg);
        //io.emit('chatMessage', msg);
    });
});
server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});
