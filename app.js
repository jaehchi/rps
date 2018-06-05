import { question, keyInSelect, keyInYNStrict, setDefaultOptions } from 'readline-sync';
import { setDefaults } from 'table-master';
import clear from 'clear';
import chalk from 'chalk';

setDefaults({ indent: 0, rowSpace: 3 });
setDefaultOptions({ guide: true });

class RPS {
  constructor() {
    this.logic = {
      'Rock': 'Scissors',
      'Paper': 'Rock',
      'Scissors': 'Paper'
    }
    this.scoreBoard = [];
    this.score = {};
    this.vs = null;
    this.p1 = null;
    this.p2 = null;
  }

  printScoreBoard() {
    console.log(chalk`{yellow ------------ SCOREBOARD -------------}`);
    console.table(this.scoreBoard, 'lcrc');
    console.log(chalk`{yellow -------------------------------------}`);
    console.log('\n');
  }

  printWinner(player) {
    console.log(chalk`{yellow Congratulations ${player}, You've Won! c:}`);
    console.log('\n');
  }

  printLoser(player) {
    console.log(chalk`{yellow Sorry, ${player}! Better luck next time! :c}`);
    console.log('\n');
  }

  promptVersusMode() {
    const vs = [ 'Single', 'Versus' ];
    console.log(chalk`{green Play against a {yellow.bold BOT (Single)} or play against a {yellow.bold FRIEND (Versus)!}}`);
    this.vs = vs[ keyInSelect(vs, chalk`{green Choice }`, { cancel: false }) ];
    clear();
  }

  promptPlayerNames() {
    const askingForName = `what's your name? `;
    this.vs === 'Single' ? (
      this.p1 = question(chalk`{green Player One, ${askingForName}}`),
      this.p2 = 'BOT Alicia'
    ) : (
        this.p1 = question(chalk`{green Player One, ${askingForName}}`),
        this.p2 = question(chalk`{green Player Two, ${askingForName}}`)
      );
    clear();
  }

  promptBestOfN() {
    if (Object.keys(this.score).length > 0) {
      this.score = {};
      clear();
    }

    const bestOfN = [ 3, 5, 7 ];
    console.log(chalk`{green 'Best out of ...?}`);
    const n = bestOfN[ keyInSelect(bestOfN, chalk`{green Choice: }`, { cancel: false }) ];

    this.score[ 'rounds' ] = n;
    this.score[ 'currentRound' ] = 1;
    this.score[ this.p1 ] = 0;
    this.score[ this.p2 ] = 0;
    clear();
  }

  promptPlayerMove(player) {
    const moves = Object.keys(this.logic);

    const options = {
      limit: [ 1, 2, 3 ],
      limitMessage: chalk`{red \nSorry, invalid move!\n}`,
      hideEchoBack: true,
      mask: chalk`{magenta \u2665}`
    };

    const move = question(
      chalk`{green Choose a move, ${player}!\n\n{white [1] Rock\n[2] Paper\n[3] Scissors}\n\nMOVE: }`, options
    );

    clear();
    return moves[ move - 1 ];
  }

  promptPlayAgain() {
    const answer = keyInYNStrict(`Play again?`);
    answer ? (this.scoreBoard = [], this.promptBestOfN(), this.play()) : (clear(), console.log(chalk`{green \nAwww.. bye T_T!\n}`))
  }

  // Bot Alicia Logic 

  botAliciaMove() {
    const moves = Object.keys(this.logic);

    const index = Math.floor(Math.random() * 3);

    return moves[ index ];
  }

  // Game Logic 

  recordMove(p1Move, p2Move, winner) {
    let color = '';

    if (winner === 'TIE') {
      color = 'bold.rgb(102, 255, 153)';
    } else if (winner === `${this.p1} Wins!`) {
      color = 'bold.rgb(255, 153, 153)';
    } else {
      color = 'bold.rgb(102, 255, 255)'
    }

    this.scoreBoard.push({
      Round: this.score.currentRound,
      [ this.p1 ]: winner === 'TIE' ? chalk`{${color} ${p1Move}}` : chalk`{bold.rgb(255, 153, 153) ${p1Move}}`,
      [ this.p2 ]: winner === 'TIE' ? chalk`{${color} ${p2Move}}` : chalk`{bold.rgb(102, 255, 255) ${p2Move}}`,
      Outcome: chalk`{${color} ${winner}}`
    });

    this.score.currentRound++;
  }

  isRoundTie(p1Move, p2Move) {
    return p1Move === p2Move ? true : false;
  }

  isPlayerOneWinner(p1Move, p2Move) {
    return this.logic[ p1Move ] === p2Move ? true : false
  }

  isWinner(player) {
    return this.score[ player ] === ((this.score.rounds + 1) / 2) ? true : false;
  }

  play() {
    if (!this.p2) { // if p2 doesn't exist, the game is just started
      this.promptVersusMode();
      this.promptPlayerNames();
      this.promptBestOfN();
    }

    const p1Move = this.promptPlayerMove(this.p1);
    const p2Move = this.vs === 'Versus' ? this.promptPlayerMove(this.p2) : this.botAliciaMove();

    if (this.isRoundTie(p1Move, p2Move)) { // check if the round is a draw

      this.recordMove(p1Move, p2Move, 'TIE');
      this.printScoreBoard();
      this.play();

    } else if (this.isPlayerOneWinner(p1Move, p2Move)) { // checks if p1 is the winner

      this.recordMove(p1Move, p2Move, `${this.p1} Wins!`);
      this.score[ this.p1 ]++;

      if (this.isWinner(this.p1)) {
        this.printScoreBoard();
        this.printWinner(this.p1);
        this.promptPlayAgain();
      } else {
        this.printScoreBoard();
        this.play();

      }

    } else {  // If there is no tie and p1 did not win, then p2 wins.

      this.recordMove(p1Move, p2Move, `${this.p2} Wins!`);
      this.score[ this.p2 ]++;

      if (this.isWinner(this.p2)) {
        if (this.vs === 'Single') {
          this.printScoreBoard();
          this.printLoser(this.p1);
          this.promptPlayAgain();
        } else {
          this.printScoreBoard();
          this.printWinner(this.p2);
          this.promptPlayAgain();
        }
      } else {
        this.printScoreBoard();
        this.play();
      }
    }
  }
}

export default RPS;
