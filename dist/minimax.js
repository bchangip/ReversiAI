'use strict';

require('underscore');

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var UPRIGHT = 4;
var UPLEFT = 5;
var DOWNRIGHT = 6;
var DOWNLEFT = 7;
var ALLDIRECTIONS = [UP, DOWN, LEFT, RIGHT, UPRIGHT, UPLEFT, DOWNRIGHT, DOWNLEFT];

var exampleBoard = [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1, 0, 2, 1, 2, 1, 1, 1, 2, 2, 2];

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

// console.log(parseBoard(exampleBoard))
// console.log('checkNeighbor', checkNeighbor(parseBoard(exampleBoard), [7,7], UPLEFT))

var unknownPosition = function unknownPosition(position, validMoves) {
  validMoves.forEach(function (validMove) {
    return true;
  });
};

var validMoves = function validMoves(board, player) {
  var opponent = player === 1 ? 2 : 1;
  var validMoves = new Set();
  // Filter opponents coins with empty spaces next to it

  var _loop = function _loop(y) {
    var _loop2 = function _loop2(x) {
      // For filtered coins
      if (board[y][x] === opponent) {
        ALLDIRECTIONS.map(function (direction) {
          console.log('position', [y, x], 'direction', direction, 'is', checkNeighbor(board, [y, x], direction));
          if (unknownPosition(move([y, x], direction), validMoves)) {
            // For empty space
            if (checkNeighbor(board, [y, x], direction) == '0') {
              // Check opposite end, if theres a player coin then add empty space to validMoves, else pass
              // console.log('Empty!! Checking', [y, x], ' in direction', oppositeDirection(direction))
              // console.log('Moving', [y, x], 'in direction', oppositeDirection(direction))
              var tempPosition = move([y, x], oppositeDirection(direction));
              // console.log('tempPosition', tempPosition)
              // console.log('Test board', board[tempPosition[0]][tempPosition[1]])
              while (tempPosition !== null) {
                console.log('IN WHILE');
                if (board[tempPosition[0]][tempPosition[1]] === player) {
                  console.log('Adding', [y, x]);
                  validMoves.add(move([y, x], direction));
                  break;
                }
                tempPosition = move(tempPosition, oppositeDirection(direction));
                // console.log('tempPosition after move', tempPosition)
              }
              // console.log('New position', tempPosition)
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
console.log('validMoves 2', validMoves(parseBoard(exampleBoard), 2));