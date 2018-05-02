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

const exampleBoard = [
  2,2,2,2,2,2,2,2,
  1,2,1,1,1,1,1,1,
  0,1,2,1,1,2,1,1,
  1,1,1,2,2,2,1,1,
  1,2,1,2,1,2,1,1,
  1,1,2,2,2,1,2,2,
  1,2,1,1,1,1,0,2,
  1,2,1,1,1,2,2,2
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
  var validMoves = []
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
  return 100 * (count[maxPlayer] - count[minPlayer]) / (count[maxPlayer] + count[minPlayer])
}

// console.log('coinParityHeuristic', coinParityHeuristic(exampleBoard, 1, 2))
// console.log('coinParityHeuristic', coinParityHeuristic(exampleBoard, 2, 1))

const mobilityHeuristic = (board, maxPlayer, minPlayer) => {
  const maxPlayerPotentialMoves = validMoves(board, maxPlayer).length
  const minPlayerPotentialMoves = validMoves(board, minPlayer).length
  // console.log('maxPlayerPotentialMoves', maxPlayerPotentialMoves)
  // console.log('minPlayerPotentialMoves', minPlayerPotentialMoves)
  if(maxPlayerPotentialMoves + minPlayerPotentialMoves){
    return 100 * (maxPlayerPotentialMoves - minPlayerPotentialMoves) / (maxPlayerPotentialMoves + minPlayerPotentialMoves)
  } else {
    return 0
  }
}

// console.log('mobilityHeuristic 1', mobilityHeuristic(parseBoard(exampleBoard), 2, 1))


const cornersHeuristic = (board, maxPlayer, minPlayer) => {
  const corners = [[0,0], [0,7], [7,7], [7,0]]
  let maxPlayerPotentialCorners = 0
  let minPlayerPotentialCorners = 0
  corners.map((corner) => {
    if(board[corner[0]][corner[1]] === maxPlayer){
      maxPlayerPotentialCorners = maxPlayerPotentialCorners + 1
    } else {
      if(board[corner[0]][corner[1]] === minPlayer){
        minPlayerPotentialCorners = minPlayerPotentialCorners + 1
      }
    }
  })

  return 100 * (maxPlayerPotentialCorners - minPlayerPotentialCorners) / (maxPlayerPotentialCorners + minPlayerPotentialCorners)
}

// 60,000 boards in 2.04s ~ Approx 5 levels down (without coin stability)
const parsedBoard = parseBoard(exampleBoard)
for(let i=0; i<60000; i++){
  coinParityHeuristic(exampleBoard, 1, 2)
  mobilityHeuristic(parsedBoard, 2, 1)
  cornersHeuristic(parsedBoard, 2, 1)
}

// console.log('cornersHeuristic', cornersHeuristic(parseBoard(exampleBoard), 2, 1))
