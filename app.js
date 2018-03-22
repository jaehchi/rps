const { question, keyInSelect, setDefaultOptions } = require('readline-sync');
const { setDefaults } = require('table-master');
const chalk = require('chalk');

setDefaults( { indent  : 0, rowSpace: 3 } );
setDefaultOptions( { guide: true } );

class RPS {
  constructor () {
    this.logic = {
      'Rock' : 'Scissors',
      'Paper': 'Rock',
      'Scissors': 'Paper'
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
    const moves = ['Rock', 'Paper', 'Scissors'];
    const options = { 
      limit : [1, 2, 3],
      limitMessage: 'Sorry, invalid move!',
      hideEchoBack: true,
      mask: chalk.magenta('\u2665')
    };

    const move = question(
      `Choose a move, ${player}!\n\n[1] Rock\n[2] Paper\n[3] Scissors\n\nMOVE: `, options
    );

    return moves[move - 1];
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
    return this.score[player] === ( ( this.score.rounds + 1 ) / 2 )  ? true : false;
  }

  play () {
    if ( !this.p1 ) {
      this.promptVersusMode();
      this.promptPlayerNames();
      this.promptBestOfN();
    }
    const p1Move = this.promptPlayerMove(this.p1);
    const p2Move = this.promptPlayerMove(this.p2);


    
    if ( this.isRoundTie( p1Move, p2Move ) ) {
      this.recordMove( p1Move, p2Move, 'TIE' );
      this.score.currentRound++;
      this.printScoreBoard();
      this.play();
    } else if ( this.isPlayerOneWinner( p1Move, p2Move ) === true ) {
      this.recordMove( p1Move, p2Move, `${this.p1} Wins!` );
      this.score.currentRound++;
      this.score[this.p1]++;

      if ( this.isWinner(this.p1) ) {
        this.printWinner(this.p1);
        this.printScoreBoard();
      } else {
        this.printScoreBoard();
        this.play();
      }

    } else {
      this.recordMove( p1Move, p2Move, `${this.p2} Wins!` );
      this.score.currentRound++;
      this.score[this.p2]++;

      if ( this.isWinner(this.p2) ) {
        this.printWinner(this.p2);
        this.printScoreBoard();
      } else {
        this.printScoreBoard();
        this.play();
      }
    }
  }
}

const game = new RPS();

game.play();

