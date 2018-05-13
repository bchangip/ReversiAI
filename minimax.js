// import 'underscore'
const _ = require('underscore')

const UP = 0
const DOWN = 1
const LEFT = 2
const RIGHT = 3
const UPRIGHT = 4
const UPLEFT = 5
const DOWNRIGHT = 6
const DOWNLEFT = 7
const ALLDIRECTIONS = [UP, DOWN, LEFT, RIGHT, UPRIGHT, UPLEFT, DOWNRIGHT, DOWNLEFT]
const HALFDIRECTIONS = [UP, RIGHT, UPRIGHT, UPLEFT]

const STABLE = 1
const SEMISTABLE = 0
const UNSTABLE = -1

const MAXIMIZER = 1
const MINIMIZER = 2

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

const exampleBoard = [
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,1,2,0,0,0,
  0,0,0,2,1,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0
]

const oppositeDirection = (direction) => {
  switch(direction){
    case UP: {
      return DOWN
    }
    case DOWN: {
      return UP
    }
    case RIGHT: {
      return LEFT
    }
    case LEFT: {
      return RIGHT
    }
    case UPRIGHT: {
      return DOWNLEFT
    }
    case UPLEFT: {
      return DOWNRIGHT
    }
    case DOWNRIGHT: {
      return UPLEFT
    }
    case DOWNLEFT: {
      return UPRIGHT
    }
  }
}

const move = (position, direction) => {
  switch(direction){
    case UP: {
      if((position[0]-1) >= 0){
        return [position[0]-1, position[1]]
      } else {
        return null
      }
    }
    case DOWN: {
      if((position[0]+1) <= 7){
        return [position[0]+1, position[1]]
      } else {
        return null
      }
    }
    case RIGHT: {
      if((position[1]+1) <= 7){
        return [position[0], position[1]+1]
      } else {
        return null
      }
    }
    case LEFT: {
      if((position[1]-1) >= 0){
        return [position[0], position[1]-1]
      } else {
        return null
      }
    }
    case UPRIGHT: {
      if((position[0]-1) >= 0 && (position[1]+1) <= 7){
        return [position[0]-1, position[1]+1]
      } else {
        return null
      }
    }
    case UPLEFT: {
      if((position[0]-1) >= 0 && (position[1]-1) >= 0){
        return [position[0]-1, position[1]-1]
      } else {
        return null
      }
    }
    case DOWNRIGHT: {
      if((position[0]+1) <= 7 && (position[1]+1) <= 7){
        return [position[0]+1, position[1]+1]
      } else {
        return null
      }
    }
    case DOWNLEFT: {
      if((position[0]+1) <= 7 && (position[1]-1) >= 0){
        return [position[0]+1, position[1]-1]
      } else {
        return null
      }
    }
  }
}

const parseBoard = (sourceBoard) => ([
  sourceBoard.slice(0,8),
  sourceBoard.slice(8,16),
  sourceBoard.slice(16,24),
  sourceBoard.slice(24,32),
  sourceBoard.slice(32,40),
  sourceBoard.slice(40,48),
  sourceBoard.slice(48,56),
  sourceBoard.slice(56,64)
])
// console.log('parsedBoard', parseBoard(exampleBoard))

const checkNeighbor = (board, position, direction) => {
  switch(direction){
    case UP: {
      if((position[0]-1) >= 0){
        return board[position[0]-1][position[1]]
      } else {
        return -1
      }
    }
    case DOWN: {
      if((position[0]+1) <= 7){
        return board[position[0]+1][position[1]]
      } else {
        return -1
      }
    }
    case RIGHT: {
      if((position[1]+1) <= 7){
        return board[position[0]][position[1]+1]
      } else {
        return -1
      }
    }
    case LEFT: {
      if((position[1]-1) >= 0){
        return board[position[0]][position[1]-1]
      } else {
        return -1
      }
    }
    case UPRIGHT: {
      if((position[0]-1) >= 0 && (position[1]+1) <= 7){
        return board[position[0]-1][position[1]+1]
      } else {
        return -1
      }
    }
    case UPLEFT: {
      if((position[0]-1) >= 0 && (position[1]-1) >= 0){
        return board[position[0]-1][position[1]-1]
      } else {
        return -1
      }
    }
    case DOWNRIGHT: {
      if((position[0]+1) <= 7 && (position[1]+1) <= 7){
        return board[position[0]+1][position[1]+1]
      } else {
        return -1
      }
    }
    case DOWNLEFT: {
      if((position[0]+1) <= 7 && (position[1]-1) >= 0){
        return board[position[0]+1][position[1]-1]
      } else {
        return -1
      }
    }
  }
}

const validPosition = (position, validMoves) => {
  // console.log('Running')
  for(let i=0; i<validMoves.length; i++){
    if(position[0] === validMoves[i][0] && position[1] === validMoves[i][1]){
      return true
    }
  }
  return false
}

const positionToServerInt = (position) => (position[0]*8+position[1])


const validMoves = (board, player) => {
  const opponent = player === 1 ? 2 : 1
  let validMoves = []
  // Filter opponents coins with empty spaces next to it
  for(let y=0; y<board.length; y++){
    for(let x=0; x<board[0].length; x++){
      // For filtered coins
      if(board[y][x] === opponent){
        ALLDIRECTIONS.map(direction => {
          // For empty space
          if(checkNeighbor(board, [y,x], direction) == '0'){
            // Check opposite end, if theres a player coin then add empty space to validMoves, else pass
            let tempPosition = move([y, x], oppositeDirection(direction))
            while(tempPosition !== null && board[tempPosition[0]][tempPosition[1]] !== 0){
              if(validPosition(move([y, x], direction), validMoves)){
                break
              }
              if(board[tempPosition[0]][tempPosition[1]] === player){
                validMoves.push(move([y, x], direction))
                break
              }
              tempPosition = move(tempPosition, oppositeDirection(direction))
            }
          }
        })
      }
    } 
  }
  // console.log('board', board)
  // console.log('player', player)
  // console.log('validMoves', validMoves)
  return validMoves
}


// console.log('validMoves 1', validMoves(parseBoard(exampleBoard), 1))
// console.log('validMoves 2', validMoves(parseBoard(exampleBoard), 2))
// console.log('serverInt', positionToServerInt([7, 7]))

// This heuristic takes a flat board
const coinParityHeuristic = (board, maxPlayer, minPlayer) => {
  const count = _.countBy(board, (position) => {
    if(position === 1){
      return 1
    } else {
      if(position === 2){
        return 2
      } else {
        return 0
      }
    }
  })
  if(count[maxPlayer] + count[minPlayer] != 0){
    return 100 * (count[maxPlayer] - count[minPlayer]) / (count[maxPlayer] + count[minPlayer])
  } else {
    return 0
  }
}

// console.log('coinParityHeuristic 1', coinParityHeuristic(exampleBoard, 1, 2))
// console.log('coinParityHeuristic', coinParityHeuristic(exampleBoard, 2, 1))

const mobilityHeuristic = (board, maxPlayer, minPlayer) => {
  const maxPlayerPotentialMoves = validMoves(board, maxPlayer).length
  const minPlayerPotentialMoves = validMoves(board, minPlayer).length
  // console.log('maxPlayerPotentialMoves', maxPlayerPotentialMoves)
  // console.log('minPlayerPotentialMoves', minPlayerPotentialMoves)
  if(maxPlayerPotentialMoves + minPlayerPotentialMoves != 0){
    return 100 * (maxPlayerPotentialMoves - minPlayerPotentialMoves) / (maxPlayerPotentialMoves + minPlayerPotentialMoves)
  } else {
    return 0
  }
}

// console.log('mobilityHeuristic 1', mobilityHeuristic(parseBoard(exampleBoard), 1, 2))


const cornersHeuristic = (board, maxPlayer, minPlayer) => {
  const corners = [[0,0], [0,7], [7,7], [7,0]]
  let maxPlayerPotentialCorners = 0
  let minPlayerPotentialCorners = 0
  corners.map((corner) => {
    if(board[corner[0]][corner[1]] == maxPlayer){
      maxPlayerPotentialCorners = maxPlayerPotentialCorners + 1
    } else {
      if(board[corner[0]][corner[1]] == minPlayer){
        minPlayerPotentialCorners = minPlayerPotentialCorners + 1
      }
    }
  })

  if(maxPlayerPotentialCorners + minPlayerPotentialCorners != 0){
    return 100 * (maxPlayerPotentialCorners - minPlayerPotentialCorners) / (maxPlayerPotentialCorners + minPlayerPotentialCorners)
  } else {
    return 0
  }
}
// console.log('cornersHeuristic 1', cornersHeuristic(parseBoard(exampleBoard), 1, 2))

const stabilityHeuristic = (board, maxPlayer, minPlayer) => {
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

  let maxPlayerStability = 0
  let minPlayerStability = 0
  for(let y=0; y<board.length; y++){
    for(let x=0; x<board[0].length; x++){
      if(board[y][x] === maxPlayer){
        let stabilities = []
        HALFDIRECTIONS.map((direction) => {
          let firstBound
          let secondBound
          let firstBoundPosition = move([y, x], direction)
          while(firstBoundPosition !== null && board[firstBoundPosition[0]][firstBoundPosition[1]] !== 0 && board[firstBoundPosition[0]][firstBoundPosition[1]] !== minPlayer){
            firstBoundPosition = move(firstBoundPosition, direction)
          }
          let secondBoundPosition = move([y, x], oppositeDirection(direction))
          while(secondBoundPosition !== null && board[secondBoundPosition[0]][secondBoundPosition[1]] !== 0 && board[secondBoundPosition[0]][secondBoundPosition[1]] !== minPlayer){
            secondBoundPosition = move(secondBoundPosition, oppositeDirection(direction))
          }

          if(firstBoundPosition !== null && secondBoundPosition !== null){
            if((board[firstBoundPosition[0]][firstBoundPosition[1]] == minPlayer && board[secondBoundPosition[0]][secondBoundPosition[1]] == 0) || (board[firstBoundPosition[0]][firstBoundPosition[1]] == 0 && board[secondBoundPosition[0]][secondBoundPosition[1]] == minPlayer)){
              stabilities.push(UNSTABLE)
            } else {
              if(board[firstBoundPosition[0]][firstBoundPosition[1]] == minPlayer && board[secondBoundPosition[0]][secondBoundPosition[1]] == minPlayer){
                stabilities.push(STABLE)
              } else {
                stabilities.push(SEMISTABLE)
              }
            }
          } else {
            stabilities.push(STABLE)
          }
        })
        // console.log('maxPlayerStabilities', stabilities)
        maxPlayerStability += _.min(stabilities)
      } else {
        if(board[y][x] === minPlayer){
          let stabilities = []
          HALFDIRECTIONS.map((direction) => {
            let firstBound
            let secondBound
            let firstBoundPosition = move([y, x], direction)
            while(firstBoundPosition !== null && board[firstBoundPosition[0]][firstBoundPosition[1]] !== 0 && board[firstBoundPosition[0]][firstBoundPosition[1]] !== maxPlayer){
              firstBoundPosition = move(firstBoundPosition, direction)
            }
            let secondBoundPosition = move([y, x], oppositeDirection(direction))
            while(secondBoundPosition !== null && board[secondBoundPosition[0]][secondBoundPosition[1]] !== 0 && board[secondBoundPosition[0]][secondBoundPosition[1]] !== maxPlayer){
              secondBoundPosition = move(secondBoundPosition, oppositeDirection(direction))
            }

            if(firstBoundPosition !== null && secondBoundPosition !== null){
              if((board[firstBoundPosition[0]][firstBoundPosition[1]] == maxPlayer && board[secondBoundPosition[0]][secondBoundPosition[1]] == 0) || (board[firstBoundPosition[0]][firstBoundPosition[1]] == 0 && board[secondBoundPosition[0]][secondBoundPosition[1]] == maxPlayer)){
                stabilities.push(UNSTABLE)
              } else {
                if(board[firstBoundPosition[0]][firstBoundPosition[1]] == maxPlayer && board[secondBoundPosition[0]][secondBoundPosition[1]] == maxPlayer){
                  stabilities.push(STABLE)
                } else {
                  stabilities.push(SEMISTABLE)
                }
              }
            } else {
              stabilities.push(STABLE)
            }
          })
          // console.log('minPlayerStabilities', stabilities)
          minPlayerStability += _.min(stabilities)
        }
      }
    }
  }
  // console.log('maxPlayerStability', maxPlayerStability)
  // console.log('minPlayerStability', minPlayerStability)

  if(maxPlayerStability + minPlayerStability != 0){
    return 100 * (maxPlayerStability - minPlayerStability) / (maxPlayerStability + minPlayerStability)
  } else {
    return 0
  }
}
// console.log('stabilityHeuristic 1', stabilityHeuristic(parseBoard(exampleBoard), 1, 2))

const heuristic = (board, maxPlayer, minPlayer) => {
  const parsedBoard = parseBoard(board)
  return coinParityHeuristic(board, maxPlayer, minPlayer) + mobilityHeuristic(parsedBoard, maxPlayer, minPlayer) + cornersHeuristic(parsedBoard, maxPlayer, minPlayer) + stabilityHeuristic(parsedBoard, maxPlayer, minPlayer)
}

// 50000 boards in 5.41s ~ Approx 4 levels down considering branching factor of 10 (Regularly the max for Reversi)
// for(let i=0; i<50000; i++){
//   heuristic(exampleBoard, 1, 2) 
// }

// const minimax()

const playMove = (board, movePosition, player) => {
  // console.log('player', player, 'move', movePosition)
  // console.log('Input board', board)
  // Calculate opponent
  const opponent = player === 1 ? 2 : 1

  // Place coin
  board[movePosition[0]][movePosition[1]] = player

  // Flip coins
  ALLDIRECTIONS.map((direction) => {
    let coinsToBeFlipped = []
    let tempPosition = move(movePosition, direction)
    while(tempPosition !== null && board[tempPosition[0]][tempPosition[1]] !== 0){
      if(board[tempPosition[0]][tempPosition[1]] === opponent){
        coinsToBeFlipped.push(tempPosition)
      } else {
        if(board[tempPosition[0]][tempPosition[1]] === player){
          if(coinsToBeFlipped.length !== 0){
            coinsToBeFlipped.map((position) => {
              board[position[0]][position[1]] = player
            })
            break
          }
        }
      }
      tempPosition = move(tempPosition, direction)
    }
  })

  // console.log('Output board', board)
  return board
}

const oppositeMinimaxMode = (mode) => {
  if(mode === MAXIMIZER){
    return MINIMIZER
  } else {
    return MAXIMIZER
  }
}

// minimaxSignature = (board, maxPlayer, minPlayer, alpha, beta, mode, depth) => (value, move)
const minimax = (board, maxPlayer, minPlayer, alpha, beta, mode, depth) => {
  console.log('board\n', board)
  if(depth !== 0){
    let possibleMoves
    if(mode === MAXIMIZER){
      possibleMoves = validMoves(board, maxPlayer)
    } else {
      possibleMoves = validMoves(board, minPlayer)
    }

    if(possibleMoves.length === 0){
      return minimax(board, maxPlayer, minPlayer, alpha, beta, oppositeMinimaxMode(mode), depth - 1)
    } else {
      for(let index in possibleMoves){
        // console.log('depth', depth)
        // console.log('board\n', board)
        // console.log('possibleMove', possibleMoves[index])

        // DEEPCOPY BOARD
        let workingBoard = [
          [0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0]
        ]
        for(let y=0; y<board.length; y++){
          for(let x=0; x<board[0].length; x++){
            workingBoard[y][x] = board[y][x]
          }
        }


        let newBoard
        if(mode === MAXIMIZER){
          newBoard = playMove(workingBoard, possibleMoves[index], maxPlayer)
        } else {
          newBoard = playMove(workingBoard, possibleMoves[index], minPlayer)
        }
        // console.log('innerMinimax', minimax(newBoard, maxPlayer, minPlayer, alpha, beta, oppositeMinimaxMode(mode), depth - 1))
        minimax(newBoard, maxPlayer, minPlayer, alpha, beta, oppositeMinimaxMode(mode), depth - 1)
      }
      // Run minimax for each possibleMoves (Remember to check alpha and beta values for pruning)
      // Return value and move
    }
  } else {
    // Evaluate heuristic of child nodes (Remember to check alpha and beta values for pruning)
    // Return value and move
  }
}

// if depth === 0 then evaluate heuristic of child nodes else call minimax on child nodes

// console.log('minimax', minimax(parseBoard(exampleBoard), 1, 2, Infinity, -Infinity, MAXIMIZER, 10))
minimax(parseBoard(exampleBoard), 1, 2, Infinity, -Infinity, MAXIMIZER, 7)

export const randomValidMove = (board, player) => {
  // console.log('Calling randomValidMove with board', board, 'player', player)
  const possibleMoves = validMoves(parseBoard(board), player)
  // console.log('possibleMoves', possibleMoves)
  return positionToServerInt(possibleMoves[_.random(possibleMoves.length - 1)])
}