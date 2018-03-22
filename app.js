const { question, keyInSelect } = require('readline-sync');
const tab = require('table-master');
const chalk = require('chalk');

tab.setDefaults({
  indent  : 3, 
  rowSpace: 3 
}); 
class RPS {
  constructor () {
    this.logic = {
      'rock' : 'scissors',
      'paper': 'rock',
      'scissors': 'paper'
    }
    this.scoreBoard = [];
    this.score = {};
    this.p1;
    this.p2;
  }

  printScoreBoard () {
    console.table(this.scoreBoard, 'lcrc')
  }

  promptBestOfN () {
    const bestOfN = [ 'Best out of 3', 'Best out of 5', 'Best out of 7' ];
    this.score['rounds'] = Number(bestOfN[ keyInSelect( bestOfN, 'Select Game Type', { guide: true } )].charAt(12) );
    this.score['currentRound'] = 1;
    this.score[this.p1] = 0;
    this.score[this.p2] = 0;
    console.log(this.score);
  }

  isRoundTie ( p1Move, p2Move ) {
    if (p1Move === p2Move) {
      return true;
    }
    return false;
  }

  isPlayerOneWinner ( p1Move, p2Move ) {
    if ( this.logic[p1Move] === p2Move ) {
      return true;
    } 
    return false;
  }

  isWinner ( player ) {
    if ( this.score[player] === ( ( this.score + 1 ) / 2 ) ) {
      return true;
    }
    return false;
  }
}

const game = new RPS();
game.printScoreBoard();
game.promptBestOfN();
