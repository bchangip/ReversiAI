'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
var HALFDIRECTIONS = [UP, RIGHT, UPRIGHT, UPLEFT];

var STABLE = 1;
var SEMISTABLE = 0;
var UNSTABLE = -1;

var MAXIMIZER = 1;
var MINIMIZER = 2;

// const exampleBoard = [
//   2,2,2,2,2,2,2,2,
//   1,2,1,1,1,1,1,1,
//   0,1,2,1,1,2,1,1,
//   1,1,1,2,2,2,1,1,
//   1,2,1,2,1,2,1,1,
//   1,1,2,2,2,1,2,2,
//   1,2,1,1,1,1,0,2,
//   1,2,1,1,1,2,2,2
// ]

var exampleBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
  // console.log('board', board)
  // console.log('player', player)
  // console.log('validMoves', validMoves)
  return validMoves;
};

// console.log('validMoves 1', validMoves(parseBoard(exampleBoard), 1))
// console.log('validMoves 2', validMoves(parseBoard(exampleBoard), 2))
// console.log('serverInt', positionToServerInt([7, 7]))

// This heuristic takes a flat board
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
  if (count[maxPlayer] + count[minPlayer] != 0) {
    return 100 * (count[maxPlayer] - count[minPlayer]) / (count[maxPlayer] + count[minPlayer]);
  } else {
    return 0;
  }
};

// console.log('coinParityHeuristic 1', coinParityHeuristic(exampleBoard, 1, 2))
// console.log('coinParityHeuristic', coinParityHeuristic(exampleBoard, 2, 1))

var mobilityHeuristic = function mobilityHeuristic(board, maxPlayer, minPlayer) {
  var maxPlayerPotentialMoves = validMoves(board, maxPlayer).length;
  var minPlayerPotentialMoves = validMoves(board, minPlayer).length;
  // console.log('maxPlayerPotentialMoves', maxPlayerPotentialMoves)
  // console.log('minPlayerPotentialMoves', minPlayerPotentialMoves)
  if (maxPlayerPotentialMoves + minPlayerPotentialMoves != 0) {
    return 100 * (maxPlayerPotentialMoves - minPlayerPotentialMoves) / (maxPlayerPotentialMoves + minPlayerPotentialMoves);
  } else {
    return 0;
  }
};

// console.log('mobilityHeuristic 1', mobilityHeuristic(parseBoard(exampleBoard), 1, 2))


var cornersHeuristic = function cornersHeuristic(board, maxPlayer, minPlayer) {
  var corners = [[0, 0], [0, 7], [7, 7], [7, 0]];
  var maxPlayerPotentialCorners = 0;
  var minPlayerPotentialCorners = 0;
  corners.map(function (corner) {
    if (board[corner[0]][corner[1]] == maxPlayer) {
      maxPlayerPotentialCorners = maxPlayerPotentialCorners + 1;
    } else {
      if (board[corner[0]][corner[1]] == minPlayer) {
        minPlayerPotentialCorners = minPlayerPotentialCorners + 1;
      }
    }
  });

  if (maxPlayerPotentialCorners + minPlayerPotentialCorners != 0) {
    return 100 * (maxPlayerPotentialCorners - minPlayerPotentialCorners) / (maxPlayerPotentialCorners + minPlayerPotentialCorners);
  } else {
    return 0;
  }
};
// console.log('cornersHeuristic 1', cornersHeuristic(parseBoard(exampleBoard), 1, 2))

var stabilityHeuristic = function stabilityHeuristic(board, maxPlayer, minPlayer) {
  // For every coin
  // Check if stable
  // stabilities = []
  // For half directions
  // firstBound = Go in direction until encounter a minPlayer coin or empty space or end-of-board
  // secondBound = Go in opposite direction until encounter a minPlayer coin or empty space or end-of-board
  // if((firstBound == minPlayer && secondBound == emptySpace) || (firstBound == empty && secondBound == minPlayer)){stabilities.push(UNSTABLE)}
  // else if((firstBound === end-of-board) && (secondBound === end-of-board)){stabilities.push(STABLE)}
  // else if((firstBound == minPlayer && secondBound == end-of-board) || (firstBound == end-of-board && secondBound == minPlayer)){stabilities.push(STABLE)}
  // else if((firstBound == minPlayer && secondBound == minPlayer)){stabilities.push(STABLE)}
  // else stabilities.push(SEMISTABLE)
  // coinStability = min(stabilities)

  var maxPlayerStability = 0;
  var minPlayerStability = 0;

  var _loop3 = function _loop3(y) {
    var _loop4 = function _loop4(x) {
      if (board[y][x] === maxPlayer) {
        var stabilities = [];
        HALFDIRECTIONS.map(function (direction) {
          var firstBound = void 0;
          var secondBound = void 0;
          var firstBoundPosition = move([y, x], direction);
          while (firstBoundPosition !== null && board[firstBoundPosition[0]][firstBoundPosition[1]] !== 0 && board[firstBoundPosition[0]][firstBoundPosition[1]] !== minPlayer) {
            firstBoundPosition = move(firstBoundPosition, direction);
          }
          var secondBoundPosition = move([y, x], oppositeDirection(direction));
          while (secondBoundPosition !== null && board[secondBoundPosition[0]][secondBoundPosition[1]] !== 0 && board[secondBoundPosition[0]][secondBoundPosition[1]] !== minPlayer) {
            secondBoundPosition = move(secondBoundPosition, oppositeDirection(direction));
          }

          if (firstBoundPosition !== null && secondBoundPosition !== null) {
            if (board[firstBoundPosition[0]][firstBoundPosition[1]] == minPlayer && board[secondBoundPosition[0]][secondBoundPosition[1]] == 0 || board[firstBoundPosition[0]][firstBoundPosition[1]] == 0 && board[secondBoundPosition[0]][secondBoundPosition[1]] == minPlayer) {
              stabilities.push(UNSTABLE);
            } else {
              if (board[firstBoundPosition[0]][firstBoundPosition[1]] == minPlayer && board[secondBoundPosition[0]][secondBoundPosition[1]] == minPlayer) {
                stabilities.push(STABLE);
              } else {
                stabilities.push(SEMISTABLE);
              }
            }
          } else {
            stabilities.push(STABLE);
          }
        });
        // console.log('maxPlayerStabilities', stabilities)
        maxPlayerStability += _.min(stabilities);
      } else {
        if (board[y][x] === minPlayer) {
          var _stabilities = [];
          HALFDIRECTIONS.map(function (direction) {
            var firstBound = void 0;
            var secondBound = void 0;
            var firstBoundPosition = move([y, x], direction);
            while (firstBoundPosition !== null && board[firstBoundPosition[0]][firstBoundPosition[1]] !== 0 && board[firstBoundPosition[0]][firstBoundPosition[1]] !== maxPlayer) {
              firstBoundPosition = move(firstBoundPosition, direction);
            }
            var secondBoundPosition = move([y, x], oppositeDirection(direction));
            while (secondBoundPosition !== null && board[secondBoundPosition[0]][secondBoundPosition[1]] !== 0 && board[secondBoundPosition[0]][secondBoundPosition[1]] !== maxPlayer) {
              secondBoundPosition = move(secondBoundPosition, oppositeDirection(direction));
            }

            if (firstBoundPosition !== null && secondBoundPosition !== null) {
              if (board[firstBoundPosition[0]][firstBoundPosition[1]] == maxPlayer && board[secondBoundPosition[0]][secondBoundPosition[1]] == 0 || board[firstBoundPosition[0]][firstBoundPosition[1]] == 0 && board[secondBoundPosition[0]][secondBoundPosition[1]] == maxPlayer) {
                _stabilities.push(UNSTABLE);
              } else {
                if (board[firstBoundPosition[0]][firstBoundPosition[1]] == maxPlayer && board[secondBoundPosition[0]][secondBoundPosition[1]] == maxPlayer) {
                  _stabilities.push(STABLE);
                } else {
                  _stabilities.push(SEMISTABLE);
                }
              }
            } else {
              _stabilities.push(STABLE);
            }
          });
          // console.log('minPlayerStabilities', stabilities)
          minPlayerStability += _.min(_stabilities);
        }
      }
    };

    for (var x = 0; x < board[0].length; x++) {
      _loop4(x);
    }
  };

  for (var y = 0; y < board.length; y++) {
    _loop3(y);
  }
  // console.log('maxPlayerStability', maxPlayerStability)
  // console.log('minPlayerStability', minPlayerStability)

  if (maxPlayerStability + minPlayerStability != 0) {
    return 100 * (maxPlayerStability - minPlayerStability) / (maxPlayerStability + minPlayerStability);
  } else {
    return 0;
  }
};
// console.log('stabilityHeuristic 1', stabilityHeuristic(parseBoard(exampleBoard), 1, 2))

var heuristic = function heuristic(board, maxPlayer, minPlayer) {
  console.log('heuristic for\n', board);
  return coinParityHeuristic(_.flatten(board), maxPlayer, minPlayer) + mobilityHeuristic(board, maxPlayer, minPlayer) + cornersHeuristic(board, maxPlayer, minPlayer) + stabilityHeuristic(board, maxPlayer, minPlayer);
};

// 50000 boards in 5.41s ~ Approx 4 levels down considering branching factor of 10 (Regularly the max for Reversi)
// for(let i=0; i<100000; i++){
//   heuristic(exampleBoard, 1, 2) 
// }

// const minimax()

var playMove = function playMove(board, movePosition, player) {
  // console.log('player', player, 'move', movePosition)
  // console.log('Input board', board)
  // Calculate opponent
  var opponent = player === 1 ? 2 : 1;

  // Place coin
  board[movePosition[0]][movePosition[1]] = player;

  // Flip coins
  ALLDIRECTIONS.map(function (direction) {
    var coinsToBeFlipped = [];
    var tempPosition = move(movePosition, direction);
    while (tempPosition !== null && board[tempPosition[0]][tempPosition[1]] !== 0) {
      if (board[tempPosition[0]][tempPosition[1]] === opponent) {
        coinsToBeFlipped.push(tempPosition);
      } else {
        if (board[tempPosition[0]][tempPosition[1]] === player) {
          if (coinsToBeFlipped.length !== 0) {
            coinsToBeFlipped.map(function (position) {
              board[position[0]][position[1]] = player;
            });
            break;
          }
        }
      }
      tempPosition = move(tempPosition, direction);
    }
  });

  // console.log('Output board', board)
  return board;
};

var oppositeMinimaxMode = function oppositeMinimaxMode(mode) {
  if (mode === MAXIMIZER) {
    return MINIMIZER;
  } else {
    return MAXIMIZER;
  }
};

// minimaxSignature = (board, maxPlayer, minPlayer, alpha, beta, mode, depth) => (value, move)
var minimax = function minimax(board, maxPlayer, minPlayer, alpha, beta, mode, depth) {
  // console.log('board\n', board)
  if (depth !== 0) {
    var possibleMoves = void 0;
    if (mode === MAXIMIZER) {
      possibleMoves = validMoves(board, maxPlayer);
    } else {
      possibleMoves = validMoves(board, minPlayer);
    }

    if (possibleMoves.length === 0) {
      return minimax(board, maxPlayer, minPlayer, alpha, beta, oppositeMinimaxMode(mode), depth - 1);
    } else {
      // Alpha and beta for childs
      var _alpha = void 0;
      var _beta = void 0;
      for (var index in possibleMoves) {
        // console.log('depth', depth)
        // console.log('board\n', board)
        // console.log('possibleMove', possibleMoves[index])

        // DEEPCOPY BOARD /////////////////////////////////////
        var workingBoard = [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]];
        for (var y = 0; y < board.length; y++) {
          for (var x = 0; x < board[0].length; x++) {
            workingBoard[y][x] = board[y][x];
          }
        }
        ///////////////////////////////////////////////////////

        var _newBoard = void 0;
        if (mode === MAXIMIZER) {
          _newBoard = playMove(workingBoard, possibleMoves[index], maxPlayer);
        } else {
          _newBoard = playMove(workingBoard, possibleMoves[index], minPlayer);
        }
        // Run minimax on child
        minimax(_newBoard, maxPlayer, minPlayer, _alpha, _beta, oppositeMinimaxMode(mode), depth - 1);
        // Compare value to alpha and beta and update them
      }
      // Run minimax for each possibleMoves (Remember to check alpha and beta values for pruning)
      // Return value and move
    }
  } else {
    // Evaluate heuristic of child nodes (Remember to check alpha and beta values for pruning)
    var _possibleMoves = void 0;
    var nodeValue = void 0;
    var nodeMove = void 0;
    if (mode === MAXIMIZER) {
      _possibleMoves = validMoves(board, maxPlayer);
      nodeValue = -Infinity;
    } else {
      nodeValue = Infinity;
      _possibleMoves = validMoves(board, minPlayer);
    }

    if (_possibleMoves.length === 0) {
      // If player doesnt have available moves then skip his turn
      minimax(newBoard, maxPlayer, minPlayer, alpha, beta, oppositeMinimaxMode(mode), depth);
    } else {
      var boardHeuristic = void 0;
      for (var _index in _possibleMoves) {
        // DEEPCOPY BOARD /////////////////////////////////////
        var _workingBoard = [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]];
        for (var _y = 0; _y < board.length; _y++) {
          for (var _x = 0; _x < board[0].length; _x++) {
            _workingBoard[_y][_x] = board[_y][_x];
          }
        }
        ///////////////////////////////////////////////////////

        var _newBoard2 = void 0;
        var heuristicMax = void 0;
        var heuristicMin = void 0;
        if (mode === MAXIMIZER) {
          _newBoard2 = playMove(_workingBoard, _possibleMoves[_index], maxPlayer);
          heuristicMax = maxPlayer;
          heuristicMin = minPlayer;
        } else {
          _newBoard2 = playMove(_workingBoard, _possibleMoves[_index], minPlayer);
          heuristicMax = minPlayer;
          heuristicMin = maxPlayer;
        }

        boardHeuristic = heuristic(_newBoard2, heuristicMax, heuristicMin);
        if (mode === MAXIMIZER) {
          if (boardHeuristic > nodeValue) {
            nodeValue = boardHeuristic;
            nodeMove = _possibleMoves[_index];
          }
        } else {
          if (boardHeuristic < nodeValue) {
            nodeValue = boardHeuristic;
            nodeMove = _possibleMoves[_index];
          }
        }
        console.log('mode', mode);
        console.log('boardHeuristic', boardHeuristic);
        console.log('nodeValue', nodeValue);
        console.log('nodeMove', nodeMove);
      }
    }
    // Return value and move
  }
};

// if depth === 0 then evaluate heuristic of child nodes else call minimax on child nodes

// console.log('minimax', minimax(parseBoard(exampleBoard), 1, 2, Infinity, -Infinity, MAXIMIZER, 10))

// minimax(parseBoard(exampleBoard), 1, 2, Infinity, -Infinity, MAXIMIZER, 8)

var randomValidMove = exports.randomValidMove = function randomValidMove(board, player) {
  // console.log('Calling randomValidMove with board', board, 'player', player)
  var possibleMoves = validMoves(parseBoard(board), player);
  // console.log('possibleMoves', possibleMoves)
  return positionToServerInt(possibleMoves[_.random(possibleMoves.length - 1)]);
};