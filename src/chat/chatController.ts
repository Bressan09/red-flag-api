import socketio from 'socket.io';
import { IMessage, IConnectionPayload } from 'red-flag-common';

import { logger } from '../middlewares';

const roomName = 'myRoom';

const roomsHistory: { [key: string]: IMessage[] } = {};

const roomHistorySize = 3;

function addMessageToHistory(roomName: string, msg: IMessage): void {
  const currentRoomHistory = roomsHistory[roomName];
  if (currentRoomHistory.length == roomHistorySize) {
    currentRoomHistory.splice(0, 1);
  }
  currentRoomHistory.push(msg);
}

function makeid(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

interface ExtendedSocket extends socketio.Socket {
  username: string;
}

function getUsersInNamespace(
  nsp: socketio.Namespace,
  roomName: string
): string[] {
  //Get object with the socketIds in the room
  const socketsInRoom = nsp.adapter.rooms[roomName].sockets;

  // Get the sockets usernames
  const users = [];
  for (const socketId in socketsInRoom) {
    if (Object.prototype.hasOwnProperty.call(nsp.sockets, socketId)) {
      const element = <ExtendedSocket>nsp.sockets[socketId];
      users.push(element.username);
    }
  }

  return users;
}

export default (io: socketio.Server): socketio.Server => {
  const chat = io.of('/chat');

  //Register connection event on the namespace
  chat.on('connection', (socket: ExtendedSocket) => {
    //Put socket in room
    socket.join(roomName);

    if (roomsHistory[roomName] == undefined) {
      roomsHistory[roomName] = [];
    }

    //Set socket username
    socket.username = makeid(10);

    //Tell other users about a new connection
    socket.broadcast.to(roomName).emit('user-connected', socket.username);

    // Get the sockets usernames
    const users = getUsersInNamespace(chat, roomName).filter(
      (value) => value != socket.username
    );

    const payload: IConnectionPayload = {
      users: users,
      messages: roomsHistory[roomName]
    };

    socket.emit('connection-payload', payload);

    logger.info(`New user connected: ${socket.username}`);

    //Register a disconnect event on the connected socket
    socket.on('disconnect', () => {
      logger.info('user disconnected: ' + socket.username);
      chat.to(roomName).emit('user-disconnected', socket.username);
    });

    //Register an event on the socket
    socket.on('send-message', (msg: IMessage) => {
      msg.user = socket.username;
      msg.isFromMe = false;
      socket.broadcast.to(roomName).emit('receive-message', msg);
      addMessageToHistory(roomName, msg);
      logger.info('Send message: ' + JSON.stringify(msg));
    });
  });
  return io;
};
