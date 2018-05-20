'use strict';

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _minimax = require('./minimax.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const socket = io('http://localhost:3000')
var socket = (0, _socket2.default)('http://192.168.0.101:4000');

socket.on('connect', function () {
  console.log('On connect');
  socket.emit('signin', {
    user_name: "chan",
    tournament_id: 142857,
    user_role: 'player'
  });
});

socket.on('ok_signin', function () {
  console.log("Successfully signed in!");
});

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var humanBoard = function humanBoard(board) {
  var outputBoard = '\nA B C D E F G H';

  for (var i = 0; i < board.length; i++) {
    if (i % 8 === 0) {
      outputBoard += '\n';
    }

    outputBoard += board[i] + ' ';
  }

  return outputBoard;
};

socket.on('ready', function (data) {
  // console.log('On ready data', data)
  var playerID = data.player_turn_id;
  // Client is about to move
  console.log("About to move. Board:", humanBoard(data.board));
  var move = (0, _minimax.randomValidMove)(data.board, data.player_turn_id);

  socket.emit('play', {
    player_turn_id: playerID,
    tournament_id: 142857,
    game_id: data.game_id,
    movement: move
  });

  console.log('Move sent', move);
});

socket.on('finish', function (data) {
  // The game has finished
  console.log("Game " + data.game_id + " has finished");

  // Inform my students that there is no rematch attribute
  console.log("Ready to play again!");

  // Start again!

  socket.emit('player_ready', {
    tournament_id: 142857,
    game_id: data.game_id,
    player_turn_id: data.player_turn_id
  });
  console.log('Successfully sent player_ready');
});

console.log('Client running');