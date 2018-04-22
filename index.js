import io from 'socket.io-client'

const socket = io('http://localhost:3000')

socket.on('connect', function(){
  socket.emit('signin', {
    user_name: "chan",
    tournament_id: 12,
    user_role: 'player'
  });
});

socket.on('ok_signin', function(){
  console.log("Successfully signed in!");
});

socket.on('ready', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var board = data.board;
});

socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;
});


console.log('TEST')