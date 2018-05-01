// import 'underscore'

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
  1,2,1,2,0,2,1,1,
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
  for(i=0; i<validMoves.length; i++){
    if(position[0] === validMoves[i][0] && position[1] === validMoves[i][1]){
      return true
    }
  }
  return false
}

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
console.log('validMoves 1', validMoves(parseBoard(exampleBoard), 1))
console.log('validMoves 2', validMoves(parseBoard(exampleBoard), 2))
