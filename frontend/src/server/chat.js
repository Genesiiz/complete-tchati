import http from 'http';
import io from 'socket.io';
import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { v4 as uuidv4 } from 'uuid';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const server = http.createServer();
const files = sirv('static', { dev });

polka({ server }) // You can also use Express
	.use(
		compression({ threshold: 0 }),
		files,
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
		console.log(`> Main chat > running on localhost:${PORT}`);
	});


// Chat room
const roomid = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
io(server).on('connection', socket => {
  // console.log('io connection');

  socket.on('join-room', userid => {
    console.log('join-room', roomid, userid);
    socket.join(roomid);
    socket.to(roomid).broadcast.emit('user-connected', userid);

    // when the client emits 'new message', this listens and executes
    socket.on('new-message', data => {
      // we tell the client to execute 'new-message'
      socket.broadcast.emit('new-message', {
        username: socket.username,
        message: data
      });
    });

    socket.on('disconnect', () => {
      socket.to(roomid).broadcast.emit('user-disconnected', userid);
    });
  });
});
