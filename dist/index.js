'use strict';

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

require('./minimax.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socket = (0, _socket2.default)('http://localhost:3000');
// const socket = io('http://192.168.5.162:4000')

socket.on('connect', function () {
  socket.emit('signin', {
    user_name: "chan",
    tournament_id: 12,
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
  console.log('On ready data', data);
  var playerID = data.player_turn_id;
  // Client is about to move
  console.log("About to move. Board:", humanBoard(data.board));

  socket.emit('play', {
    player_turn_id: playerID,
    tournament_id: 12,
    game_id: data.game_id,
    movement: randInt(0, 63)
  });
});

socket.on('finish', function (data) {
  console.log('On finish');
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;
});

console.log('Client running');