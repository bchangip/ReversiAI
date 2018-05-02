'use strict';

// import 'underscore'
var _ = require('underscore');

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var UPRIGHT = 4;
var UPLEFT = 5;
var DOWNRIGHT = 6;
var DOWNLEFT = 7;
var ALLDIRECTIONS = [UP, DOWN, LEFT, RIGHT, UPRIGHT, UPLEFT, DOWNRIGHT, DOWNLEFT];

var exampleBoard = [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 1, 2, 0, 2, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1, 0, 2, 1, 2, 1, 1, 1, 2, 2, 2];

var oppositeDirection = function oppositeDirection(direction) {
  switch (direction) {
    case UP:
      {
        return DOWN;
      }
    case DOWN:
      {
        return UP;
      }
    case RIGHT:
      {
        return LEFT;
      }
    case LEFT:
      {
        return RIGHT;
      }
    case UPRIGHT:
      {
        return DOWNLEFT;
      }
    case UPLEFT:
      {
        return DOWNRIGHT;
      }
    case DOWNRIGHT:
      {
        return UPLEFT;
      }
    case DOWNLEFT:
      {
        return UPRIGHT;
      }
  }
};

var move = function move(position, direction) {
  switch (direction) {
    case UP:
      {
        if (position[0] - 1 >= 0) {
          return [position[0] - 1, position[1]];
        } else {
          return null;
        }
      }
    case DOWN:
      {
        if (position[0] + 1 <= 7) {
          return [position[0] + 1, position[1]];
        } else {
          return null;
        }
      }
    case RIGHT:
      {
        if (position[1] + 1 <= 7) {
          return [position[0], position[1] + 1];
        } else {
          return null;
        }
      }
    case LEFT:
      {
        if (position[1] - 1 >= 0) {
          return [position[0], position[1] - 1];
        } else {
          return null;
        }
      }
    case UPRIGHT:
      {
        if (position[0] - 1 >= 0 && position[1] + 1 <= 7) {
          return [position[0] - 1, position[1] + 1];
        } else {
          return null;
        }
      }
    case UPLEFT:
      {
        if (position[0] - 1 >= 0 && position[1] - 1 >= 0) {
          return [position[0] - 1, position[1] - 1];
        } else {
          return null;
        }
      }
    case DOWNRIGHT:
      {
        if (position[0] + 1 <= 7 && position[1] + 1 <= 7) {
          return [position[0] + 1, position[1] + 1];
        } else {
          return null;
        }
      }
    case DOWNLEFT:
      {
        if (position[0] + 1 <= 7 && position[1] - 1 >= 0) {
          return [position[0] + 1, position[1] - 1];
        } else {
          return null;
        }
      }
  }
};

var parseBoard = function parseBoard(sourceBoard) {
  return [sourceBoard.slice(0, 8), sourceBoard.slice(8, 16), sourceBoard.slice(16, 24), sourceBoard.slice(24, 32), sourceBoard.slice(32, 40), sourceBoard.slice(40, 48), sourceBoard.slice(48, 56), sourceBoard.slice(56, 64)];
};
// console.log('parsedBoard', parseBoard(exampleBoard))

var checkNeighbor = function checkNeighbor(board, position, direction) {
  switch (direction) {
    case UP:
      {
        if (position[0] - 1 >= 0) {
          return board[position[0] - 1][position[1]];
        } else {
          return -1;
        }
      }
    case DOWN:
      {
        if (position[0] + 1 <= 7) {
          return board[position[0] + 1][position[1]];
        } else {
          return -1;
        }
      }
    case RIGHT:
      {
        if (position[1] + 1 <= 7) {
          return board[position[0]][position[1] + 1];
        } else {
          return -1;
        }
      }
    case LEFT:
      {
        if (position[1] - 1 >= 0) {
          return board[position[0]][position[1] - 1];
        } else {
          return -1;
        }
      }
    case UPRIGHT:
      {
        if (position[0] - 1 >= 0 && position[1] + 1 <= 7) {
          return board[position[0] - 1][position[1] + 1];
        } else {
          return -1;
        }
      }
    case UPLEFT:
      {
        if (position[0] - 1 >= 0 && position[1] - 1 >= 0) {
          return board[position[0] - 1][position[1] - 1];
        } else {
          return -1;
        }
      }
    case DOWNRIGHT:
      {
        if (position[0] + 1 <= 7 && position[1] + 1 <= 7) {
          return board[position[0] + 1][position[1] + 1];
        } else {
          return -1;
        }
      }
    case DOWNLEFT:
      {
        if (position[0] + 1 <= 7 && position[1] - 1 >= 0) {
          return board[position[0] + 1][position[1] - 1];
        } else {
          return -1;
        }
      }
  }
};

var validPosition = function validPosition(position, validMoves) {
  // console.log('Running')
  for (var i = 0; i < validMoves.length; i++) {
    if (position[0] === validMoves[i][0] && position[1] === validMoves[i][1]) {
      return true;
    }
  }
  return false;
};

var positionToServerInt = function positionToServerInt(position) {
  return position[0] * 8 + position[1];
};

// coinsOfPlayer takes a flat board
var coinsOfPlayer = function coinsOfPlayer(board, player) {
  return _.countBy(board, function (position) {
    if (position === 1) {
      return 1;
    } else {
      if (position === 2) {
        return 2;
      } else {
        return 0;
      }
    }
  })[player];
};

console.log('Coins of player 1', coinsOfPlayer(exampleBoard, 1));
console.log('Coins of player 2', coinsOfPlayer(exampleBoard, 2));

var coinParityHeuristic = function coinParityHeuristic(board, maxPlayer, minPlayer) {
  var count = _.countBy(board, function (position) {
    if (position === 1) {
      return 1;
    } else {
      if (position === 2) {
        return 2;
      } else {
        return 0;
      }
    }
  });
  return 100 * (count[maxPlayer] - count[minPlayer]) / (count[maxPlayer] + count[minPlayer]);
};

console.log('coinParityHeuristic', coinParityHeuristic(exampleBoard, 1, 2));

var validMoves = function validMoves(board, player) {
  var opponent = player === 1 ? 2 : 1;
  var validMoves = [];
  // Filter opponents coins with empty spaces next to it

  var _loop = function _loop(y) {
    var _loop2 = function _loop2(x) {
      // For filtered coins
      if (board[y][x] === opponent) {
        ALLDIRECTIONS.map(function (direction) {
          // For empty space
          if (checkNeighbor(board, [y, x], direction) == '0') {
            // Check opposite end, if theres a player coin then add empty space to validMoves, else pass
            var tempPosition = move([y, x], oppositeDirection(direction));
            while (tempPosition !== null && board[tempPosition[0]][tempPosition[1]] !== 0) {
              if (validPosition(move([y, x], direction), validMoves)) {
                break;
              }
              if (board[tempPosition[0]][tempPosition[1]] === player) {
                validMoves.push(move([y, x], direction));
                break;
              }
              tempPosition = move(tempPosition, oppositeDirection(direction));
            }
          }
        });
      }
    };

    for (var x = 0; x < board[0].length; x++) {
      _loop2(x);
    }
  };

  for (var y = 0; y < board.length; y++) {
    _loop(y);
  }
  return validMoves;
};

// console.log('validMoves 1', validMoves(parseBoard(exampleBoard), 1))
// console.log('validMoves 2', validMoves(parseBoard(exampleBoard), 2))
// console.log('serverInt', positionToServerInt([7, 7]))