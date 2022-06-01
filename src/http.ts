// @ts-ignore
import { app } from './app.ts';
// @ts-ignore
import http from 'http';
import * as socket from 'socket.io';

const serverHttp = http.createServer(app);

const io = new socket.Server(serverHttp, {
  cors: {
    origin: ['https://www.mydomain.com:*'],
    methods: ['GET', 'POST'],
  },
  allowEIO3: true,
  cookie: {
    name: 'domainio',
    httpOnly: false,
    secure: true,
  },
});

export { serverHttp, io };
