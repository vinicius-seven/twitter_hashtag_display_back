//@ts-ignore
import { io } from './http.ts';

import { Socket } from 'socket.io';

let state = {
  hashtag: '',
  monitoring: false,
  received: [],
  approved: [],
  rejected: [],
};

io.on('connection', (socket: Socket) => {
  console.log('Usuário Conectado', socket.id);
  socket.emit('initialState', state);
});
