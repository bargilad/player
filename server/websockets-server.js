const express = require('express');
const ws = require('ws');
const app = express();
const wsServer = new ws.Server({ noServer: true });

let arrayOfSongs =[];
const socketsList = [];
const EMessageTypes_AddSong = 'AddSong';
const EMessageTypes_RemoveSong = 'RemoveSong';
const EMessageTypes_ReplaceList = 'ReplaceList';


wsServer.on('connection', socket => {
  //verify close connection
  socketsList.push(socket);
  socket.send(JSON.stringify({requestType: 'init', songs: arrayOfSongs}));
  socket.on('message',msg => handleMessage(msg));
});

function handleAddSongMessage(parsedMsg){
  parsedMsg.data.id = arrayOfSongs.length;
  arrayOfSongs.push(parsedMsg.data);
}

function handleRemoveSongMessage(parsedMsg){
  const songIndexToRemove = arrayOfSongs.findIndex(song => song.id === parsedMsg.data.id);
  arrayOfSongs.splice(songIndexToRemove, 1);
}

function handleReplaceListMessage(parsedMsg){
  arrayOfSongs = parsedMsg.data
}

const requestsHandlers = new Map([
  [EMessageTypes_AddSong, handleAddSongMessage],
  [EMessageTypes_RemoveSong, handleRemoveSongMessage],
  [EMessageTypes_ReplaceList, handleReplaceListMessage ]
]);

function sendMessageToAllClients(parsedMsg) {
  socketsList.forEach(socket => socket.send(JSON.stringify(
    {
      requestType: parsedMsg.type,
      songs: arrayOfSongs
    })
    )
  );
}

function handleMessage(msg){
  const parsedMsg = JSON.parse(msg);
  const requestHandler = requestsHandlers.get(parsedMsg.type);
  requestHandler(parsedMsg);
  sendMessageToAllClients(parsedMsg);
}

const server = app.listen(3001);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});
