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

var exampleBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
  var flatBoard = _.flatten(board);
  var count = _.countBy(flatBoard, function (position) {
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
  // console.log('coinParityHeuristic', coinParityHeuristic(board, maxPlayer, minPlayer))
  // console.log('mobilityHeuristic', mobilityHeuristic(board, maxPlayer, minPlayer))
  // console.log('cornersHeuristic', cornersHeuristic(board, maxPlayer, minPlayer))
  // console.log('stabilityHeuristic', stabilityHeuristic(board, maxPlayer, minPlayer))
  return (25 * coinParityHeuristic(board, maxPlayer, minPlayer) + 5 * mobilityHeuristic(board, maxPlayer, minPlayer) + 30 * cornersHeuristic(board, maxPlayer, minPlayer) + 25 * stabilityHeuristic(board, maxPlayer, minPlayer)) / 85;
};

// 50000 boards in 5.41s ~ Approx 4 levels down considering branching factor of 10 (Regularly the max for Reversi)
// for(let i=0; i<50000; i++){
//   heuristic(exampleBoard, 1, 2) 
// }

// const minimax()

var playMove = function playMove(board, movePosition, player) {
  // console.log('Player playing', player)
  // console.log('player', player, 'move', movePosition)
  // console.log('Input board', board)
  // Calculate opponent
  var copiedBoard = [];
  for (var yi = 0; yi < board.length; yi++) {
    copiedBoard.push([]);
    for (var xi = 0; xi < board[0].length; xi++) {
      copiedBoard[yi].push(board[yi][xi]);
    }
  }

  var opponent = player === 1 ? 2 : 1;

  // Place coin
  copiedBoard[movePosition[0]][movePosition[1]] = player;

  // Flip coins
  ALLDIRECTIONS.map(function (direction) {
    var coinsToBeFlipped = [];
    var tempPosition = move(movePosition, direction);
    while (tempPosition !== null && copiedBoard[tempPosition[0]][tempPosition[1]] !== 0) {
      if (copiedBoard[tempPosition[0]][tempPosition[1]] === opponent) {
        coinsToBeFlipped.push(tempPosition);
      } else {
        if (copiedBoard[tempPosition[0]][tempPosition[1]] === player) {
          if (coinsToBeFlipped.length !== 0) {
            coinsToBeFlipped.map(function (position) {
              copiedBoard[position[0]][position[1]] = player;
            });
            break;
          }
        }
      }
      tempPosition = move(tempPosition, direction);
    }
  });

  // console.log('Output copiedBoard', copiedBoard)
  return copiedBoard;
};

var oppositeMinimaxMode = function oppositeMinimaxMode(mode) {
  if (mode === MAXIMIZER) {
    return MINIMIZER;
  } else {
    return MAXIMIZER;
  }
};

var randomValidMove = exports.randomValidMove = function randomValidMove(board, player) {
  // console.log('Calling randomValidMove with board', board, 'player', player)
  var possibleMoves = validMoves(parseBoard(board), player);
  // console.log('possibleMoves', possibleMoves)
  return positionToServerInt(possibleMoves[_.random(possibleMoves.length - 1)]);
};

/*

minimax = (board, maxPlayer, minPlayer, alpha, beta, mode, depth) => (value, maybe move)

minimax(board, maxPlayer, minPlayer, alpha, beta, mode, depth):
  Obtener movimientos validos para el maxPlayer
  Si no hay movimientos validos
    Si el oponente tiene movimientos validos, llamar a minimax con el mismo depth pero cambiando el modo
    Si el oponente no tiene movimientos validos, calcular heuristica dependiendo del modo del tablero actual y retornar valor con movimiento null
  Si hay movimientos validos
    Inicializar valor de nodo como el peor, dependiendo del modo
    Para cada movimiento valido
      Comparar el valor del nodo con alpha o beta, dependiendo del modo, para ver si se puede saltar ésta iteración
      Obtener el tablero luego de poner la pieza
      Si depth no es 0
        Llamar a minimax con el nuevo tablero y nuevos alpha y beta, volteando el modo y restando 1 de depth
      Si depth es 0
        Calcular la heuristica del tablero, dependiendo del modo
      Actualizar alpha o beta y el valor del nodo con el movimiento correspondiente, dependiendo si corresponde dependiendo del modo
    Return valor de nodo con el movimiento correspondiente

minimax(board, maxPlayer, minPlayer, -Infinity, Infinity, MAXIMIZER, 5)

*/

var minimax = exports.minimax = function minimax(board, maxPlayer, minPlayer, alpha, beta, mode, parentMode, depth) {
  // console.log('#####################################################################', mode)
  // console.log('depth', depth, 'mode', mode, 'parentMode', parentMode)
  // console.log('board\n', board)
  // Get valid moves for current player
  var nodeMoves = void 0;
  if (mode === MAXIMIZER) {
    nodeMoves = validMoves(board, maxPlayer);
  } else {
    nodeMoves = validMoves(board, minPlayer);
  }

  // console.log('nodeMoves', nodeMoves)

  if (nodeMoves.length === 0) {
    // If there isnt validMoves for current player
    // Check if opponent has validMoves
    var opponentMoves = void 0;
    if (mode === MAXIMIZER) {
      opponentMoves = validMoves(board, minPlayer);
    } else {
      opponentMoves = validMoves(board, maxPlayer);
    }
    if (opponentMoves.length === 0) {
      // If opponent doesnt have validMoves, then we have reached a leaf in the tree, calculate heuristic and return with null move
      return [heuristic(board, maxPlayer, minPlayer), -1];
    } else {
      // If opponent have validMoves, then call minimax changing the mode and keeping the depth
      return minimax(board, maxPlayer, minPlayer, alpha, beta, oppositeMinimaxMode(mode), mode, depth);
    }
  } else {
    // If current player have validMoves
    // Initialize node value as the worst, depending on the mode
    var nodeValue = void 0;
    var nodeMove = void 0;
    var nodeAlpha = alpha;
    var nodeBeta = beta;
    if (mode === MAXIMIZER) {
      nodeValue = -Infinity;
      nodeMove = -1;
    } else {
      nodeValue = Infinity;
      nodeMove = -1;
    }

    for (var i = 0; i < nodeMoves.length; i++) {
      // For every valid move
      // Compare nodeValue with nodeAlpha or nodeBeta (depending on the mode and parentMode) to see if we can skip this iteration
      if (parentMode === MINIMIZER && mode === MAXIMIZER) {
        // If mode is a maximizer and parentMode is a minimizer, if parentNode can already can achieve a lower value in another move, then skip this exploration
        // Because the maximizer will always take the higher value
        if (nodeValue > nodeBeta) {
          // console.log('PRUNING')
          continue;
        }
      }

      if (parentMode === MAXIMIZER && mode === MINIMIZER) {
        // If mode is a minimizer and parentMode is a maximizer, if parentNode can already can achieve a higher value in another move, then skip this exploration
        // Because the minimizer will always take the lower value
        if (nodeValue < nodeAlpha) {
          // console.log('PRUNING')
          continue;
        }
      }

      // Get board after playing the move
      var newBoard = void 0;
      if (mode === MAXIMIZER) {
        newBoard = playMove(board, nodeMoves[i], maxPlayer);
      } else {
        newBoard = playMove(board, nodeMoves[i], minPlayer);
      }
      // console.log('newBoard', newBoard)

      var moveValue = void 0;
      if (depth !== 0) {
        // If depth isnt 0
        // Call minimax with the newBoard, updated nodeAlpha and nodeBeta, switching modes and decreasing 1 to the depth
        moveValue = minimax(newBoard, maxPlayer, minPlayer, nodeAlpha, nodeBeta, oppositeMinimaxMode(mode), mode, depth - 1);
      } else {
        // If depth is 0
        // Calculate heuristic of the newBoard
        // console.log('heuristic value', heuristic(newBoard, maxPlayer, minPlayer))
        moveValue = [heuristic(newBoard, maxPlayer, minPlayer), nodeMoves[i]];
      }

      // Update nodeValue, nodeMode, nodeAlpha and nodeBeta, depending on the mode
      if (mode === MAXIMIZER) {
        if (moveValue[0] > nodeValue) {
          // console.log('UPDATING MAXIMIZER')
          // console.log('previous value', nodeValue, 'new value', moveValue[0])
          nodeValue = moveValue[0];
          nodeMove = nodeMoves[i];
          if (moveValue[0] > nodeAlpha) {
            nodeAlpha = moveValue[0];
          }
        }
      } else {
        if (moveValue[0] < nodeValue) {
          // console.log('UPDATING MINIMIZER')
          // console.log('previous value', nodeValue, 'new value', moveValue[0])
          nodeValue = moveValue[0];
          nodeMove = nodeMoves[i];
          if (moveValue[0] < nodeBeta) {
            nodeBeta = moveValue[0];
          }
        }
      }
    }

    return [nodeValue, nodeMove];
  }
};

var opponent = function opponent(id) {
  if (id === 1) {
    return 2;
  } else {
    return 1;
  }
};

var simpleMinimax = exports.simpleMinimax = function simpleMinimax(board, maxPlayer) {
  return positionToServerInt(minimax(parseBoard(board), maxPlayer, opponent(maxPlayer), -Infinity, Infinity, MAXIMIZER, MAXIMIZER, 5)[1]);
};

// const minimaxResponse = minimax(parseBoard(exampleBoard), 1, 2, -Infinity, Infinity, MAXIMIZER, MAXIMIZER, 1)
// console.log('minimax', minimaxResponse[0], minimaxResponse[1], positionToServerInt(minimaxResponse[1]))