const express = require('express'); // same as PHP
const app = express();
const io = require('socket.io')(); //activate the chat plugin


//serve up static files
app.use(express.static('public'));

//add routes

app.use(require('./routes/index'));
//app.use(require('./routes/contact'));
//app.use(require('./routes/portfolio'));


const server = app.listen(3000, () => {
    console.log('listening on port 3000');
});

io.attach(server);


var userCount = 0;

io.on('connection', function(socket) {

  //console.log('${socket.id} a user has connected');
  //io.emit('chat message', { for : 'everyone', message : `${socket.id} has joined!`}); //default message when someone joins
  userCount++;
  console.log(userCount);

  //handle messages sent from the client
  socket.on('chat message', function(msg) {
    io.emit('chat message', { for : 'everyone', message : msg});
  });

  socket.on('disconnect', function() {
    //console.log('a user has disconnected');
    userCount--;
    console.log(userCount);
    io.emit('disconnect message', `${socket.id} has disconnected.`);
  });
});
