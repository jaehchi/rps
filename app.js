const { question, keyInSelect, setDefaultOptions } = require('readline-sync');
const { setDefaults } = require('table-master');
const clear = require('clear')
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
    console.log(chalk.yellow(`------------ SCOREBOARD -------------`, ));
    console.table(this.scoreBoard, 'lcrc');
    console.log(chalk.yellow('-------------------------------------'));
    console.log('\n');
  }

  printWinner ( player ) {
    console.log(chalk.yellow(chalk`Congratulations ${player}, You've Won! c:`));
    console.log('\n');
  }

  printLoser ( player ) {
    // For single player...
    console.log(chalk`{yellow Sorry, ${player}, Better luck next time!}: :c`);
  }

  promptVersusMode () {
    const mode = ['Single', 'Versus'];
    console.log(chalk`{green Play against a {yellow.bold BOT (Single)} or play against a {yellow.bold FRIEND (Versus)!}}`);
    this.mode = mode[ keyInSelect(mode, chalk`{green Choice }`, { cancel : false }) ];
    clear();
  }

  promptPlayerNames () {
    const askingForName = `what's your name? `;
    this.mode === 'Single' ? (
      this.p1 = question(chalk`{green Player One, ${askingForName}}`),
      this.p2 = 'BOT Alicia'
    ) : ( 
      this.p1 = question(chalk`{green Player One, ${askingForName}}`),
      this.p2 = question(chalk`{green Player Two, ${askingForName}}`)
    );
    clear();
  }

  promptBestOfN () {
    const bestOfN = [ 'Best out of 3', 'Best out of 5', 'Best out of 7' ];
    console.log(chalk`{green 'Best out of ...?}`);
    this.score['rounds'] = Number( bestOfN[ keyInSelect( bestOfN, chalk`{green Choice: }`, { cancel : false }) ].charAt(12) );
    this.score['currentRound'] = 1;
    this.score[this.p1] = 0;
    this.score[this.p2] = 0;
    clear();
  }

  promptPlayerMove ( player ) {
    const moves = ['Rock', 'Paper', 'Scissors'];
    const options = { 
      limit : [1, 2, 3],
      limitMessage: chalk`{red \nSorry, invalid move!\n'}`,
      hideEchoBack: true,
      mask: chalk`{magenta \u2665}`
    };

    const move = question(
      chalk`{green Choose a move, ${player}!\n\n{white [1] Rock\n[2] Paper\n[3] Scissors}\n\nMOVE: }`, options
    );

    clear();
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

    // chalk`{bold.rgb(10,100,200) Hello!}`
    // rgb(255, 153, 153)
    // rgb(102, 255, 255)
    if ( this.isRoundTie( p1Move, p2Move ) ) {
      this.recordMove( chalk`{bold.rgb(102, 255, 153) ${p1Move}}`, chalk`{bold.rgb(102, 255, 153) ${p2Move}}`, chalk`{green TIE}` );
      this.score.currentRound++;
      this.printScoreBoard();
      this.play();
    } else if ( this.isPlayerOneWinner( p1Move, p2Move ) ) {
      this.recordMove( chalk`{bold.rgb(255, 153, 153) ${p1Move}}`, chalk`{bold.rgb(102, 255, 255) ${p2Move}}`, chalk`{bold.rgb(255, 153, 153) ${this.p1} Wins!}` );
      this.score.currentRound++;
      this.score[this.p1]++;

      if ( this.isWinner(this.p1) ) {
        this.printScoreBoard();
        this.printWinner(this.p1);
      } else {
        this.printScoreBoard();
        this.play();
      }

    } else {
      this.recordMove( chalk`{bold.rgb(255, 153, 153) ${p1Move}}`, chalk`{bold.rgb(102, 255, 255) ${p2Move}}`, chalk`{bold.rgb(102, 255, 255) ${this.p2} Wins!}` );
      this.score.currentRound++;
      this.score[this.p2]++;

      if ( this.isWinner(this.p2) ) {
        this.printScoreBoard();
        this.printWinner(this.p2);
      } else {
        this.printScoreBoard();
        this.play();
      }
    }
  }
}

const game = new RPS();
game.play();

