const { question, keyInSelect, setDefaultOptions } = require('readline-sync');
const { setDefaults } = require('table-master');
const chalk = require('chalk');

setDefaults( { indent  : 3, rowSpace: 3 } );
setDefaultOptions( { guide: true } );

class RPS {
  constructor () {
    this.logic = {
      'rock' : 'scissors',
      'paper': 'rock',
      'scissors': 'paper'
    }
    this.scoreBoard = [];
    this.score = {};
    this.mode;
    this.p1;
    this.p2;
  }

  printScoreBoard () {
    console.table(this.scoreBoard, 'lcrc');
  }

  printWinner ( player ) {
    console.log(`Congratulations ${player}, You've Won!`);
  }

  printLoser ( player ) {
    // For single player...
    console.log(`Sorry, ${player}, Better luck next time!`)
  }

  promptVersusMode () {
    const mode = ['Single', 'Versus'];
    console.log('Play against a Bot (Single) or play against a Friend (Versus)!');
    this.mode = mode[ keyInSelect(mode, 'Choice: ', { cancel : false }) ];
  }

  promptPlayerNames () {
    const askingForName = `what's your name? `;
    this.mode === 'Single' ? (
      this.p1 = question(askingForName), 
      this.p2 = 'BOT Alicia'
    ) : ( 
      this.p1 = question(`Player One, ${askingForName}`),
      this.p2 = question(`Player Two, ${askingForName}`)
    );
  }

  promptBestOfN () {
    const bestOfN = [ 'Best out of 3', 'Best out of 5', 'Best out of 7' ];
    console.log('Best out of ...?');
    this.score['rounds'] = Number( bestOfN[ keyInSelect( bestOfN, 'Choice: ',{ cancel : false }) ].charAt(12) );
    this.score['currentRound'] = 1;
    this.score[this.p1] = 0;
    this.score[this.p2] = 0;
  }

  promptPlayerMove ( player ) {
    const moves = ['r', 'p', 's'];
    const options = { 
      limit : [1, 2, 3],
      limitMessage: 'Sorry, invalid move!',
      hideEchoBack: true,
      mask: chalk.magenta('\u2665')
    };

    const move = question(`Choose a move, ${player}!\n\n[1] Rock\n[2] Scissors\n[3] Paper\n\nMOVE: `, options)
  }

  // Game Logic 
  recordMove ( p1Move, p2Move, winner ) {
    this.scoreBoard.push( {
      Round : this.score.currentRound,
      [this.p1]: p1Move,
      [this.p2]: p2Move,
      Outcome: winner
    } );
  }

  isRoundTie ( p1Move, p2Move ) {
    return p1Move === p2Move ? true : false;
  }

  isPlayerOneWinner ( p1Move, p2Move ) {
    return this.logic[p1Move] === p2Move ? true : false
  }

  isWinner ( player ) {
    return this.score[player] === ( ( this.score + 1 ) / 2 )  ? true : false;
  }

  play () {

  }
}

const game = new RPS();
game.promptVersusMode();
game.promptPlayerNames();
game.promptBestOfN();
game.printScoreBoard();
game.promptPlayerMove(game.p1);

