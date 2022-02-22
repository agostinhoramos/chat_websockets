var moment = require ('moment');
var express = require ('express');
var app = express();
var http = require ('http').Server(app);
const io = require('socket.io')(http);

// .Env
const dotenv = require('dotenv');
dotenv.config();

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
	var users = [];

		//prevent searching clientInfo object for rooms that don't exist
		if (typeof info === 'undefined'){
			return;
		}	

		//Object.keys takes an object and returns all atributes on that object	
		Object.keys(clientInfo).forEach(function (socketId){
			var userInfo = clientInfo[socketId];

			if(info.room === userInfo.room){
				users.push(userInfo.name);
			}
		});

		socket.emit('message', {
			name: 'System',
			text: 'Current users: ' + users.join(', '),
			timespamp: moment().valueOf()
		});
}

io.on('connection', function(socket){
	console.log('User connected via socket.io');

	socket.on('disconnect', function(){
		
		if(typeof clientInfo[socket.id] !== 'undefined'){
			
			socket.leave(clientInfo[socket.id].room);
			io.to(clientInfo[socket.id].room).emit('message', {
				name: 'System',
				text: clientInfo[socket.id].name + ' has left the conversation',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}

	});

	socket.on('joinRoom', function (joinRoom){
		
		clientInfo[socket.id] = joinRoom;
		socket.join(joinRoom.room);
		socket.broadcast.to(joinRoom.room).emit('message', {
			name: 'System',
			text: joinRoom.name + ' has joined!',
			timestamp: moment().valueOf()
		});
	});

	socket.on('message', function(message){
		console.log('message recieved: ' + message.text);
			
		if(message.text === '@currentUsers'){
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();	
			let snd = io;
			if( true ){ // Enable broadcast
				snd = socket.broadcast;
			}
			//.to(clientInfo[socket.id].room).emit('message', message);
			snd.to(clientInfo[socket.id].room).emit('message', message);
		}

	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat app',
		timestamp: moment().valueOf()
	});

});

var PORT = process.env.PORT || 3000;

//start server
http.listen(PORT, function (){
	console.log(`Server started! ${PORT}`);
})