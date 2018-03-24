const { question, keyInSelect, setDefaultOptions } = require('readline-sync');
const { setDefaults } = require('table-master');
const clear = require('clear');
const chalk = require('chalk');

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
    this.vs;
    this.p1;
    this.p2;
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
    const bestOfN = [ 3, 5, 7, `FOREVER... YOU HAVE BEEN WARNED` ];
    console.log(chalk`{green 'Best out of ...?}`);
    // this.score[ 'rounds' ] = Number(bestOfN[ keyInSelect(bestOfN, chalk`{green Choice: }`, { cancel: false }) ].charAt(12));
    const n = bestOfN[ keyInSelect(bestOfN, chalk`{green Choice: }`, { cancel: false }) ];
    this.score[ 'rounds' ] = typeof n === 'string' ? 100000 : n;
    this.score[ 'currentRound' ] = 1;
    this.score[ this.p1 ] = 0;
    this.score[ this.p2 ] = 0;
    clear();
  }

  promptPlayerMove(player) {
    const moves = Object.keys(this.logic);

    const options = {
      limit: [ 1, 2, 3 ],
      limitMessage: chalk`{red \nSorry, invalid move!\n'}`,
      hideEchoBack: true,
      mask: chalk`{magenta \u2665}`
    };

    const move = question(
      chalk`{green Choose a move, ${player}!\n\n{white [1] Rock\n[2] Paper\n[3] Scissors}\n\nMOVE: }`, options
    );

    clear();
    return moves[ move - 1 ];
  }

  // Bot Alicia Logic 

  botAliciaMove() {
    const moves = Object.keys(this.logic);

    const index = Math.floor(Math.random() * 3);
    console.log(moves[ index ])

    return moves[ index ];
  }

  // Game Logic 

  recordMove(p1Move, p2Move, winner) {
    this.scoreBoard.push({
      Round: this.score.currentRound,
      [ this.p1 ]: p1Move,
      [ this.p2 ]: p2Move,
      Outcome: winner
    });
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

      this.recordMove(chalk`{bold.rgb(102, 255, 153) ${p1Move}}`, chalk`{bold.rgb(102, 255, 153) ${p2Move}}`, chalk`{bold.rgb(102, 255, 153) TIE}`);
      this.score.currentRound++;
      this.printScoreBoard();
      this.play();

    } else if (this.isPlayerOneWinner(p1Move, p2Move)) { // checks if p1 is the winner

      this.recordMove(chalk`{bold.rgb(255, 153, 153) ${p1Move}}`, chalk`{bold.rgb(102, 255, 255) ${p2Move}}`, chalk`{bold.rgb(255, 153, 153) ${this.p1} Wins!}`);
      this.score.currentRound++;
      this.score[ this.p1 ]++;

      if (this.isWinner(this.p1)) {
        this.printScoreBoard();
        this.printWinner(this.p1);
      } else {
        this.printScoreBoard();
        this.play();
      }

    } else {  // If there is no tie and p1 did not win, then p2 wins.
      this.recordMove(chalk`{bold.rgb(255, 153, 153) ${p1Move}}`, chalk`{bold.rgb(102, 255, 255) ${p2Move}}`, chalk`{bold.rgb(102, 255, 255) ${this.p2} Wins!}`);
      this.score.currentRound++;
      this.score[ this.p2 ]++;

      if (this.isWinner(this.p2)) {
        if (this.vs === 'Single') {
          this.printScoreBoard();
          this.printLoser(this.p1);
        } else {
          this.printScoreBoard();
          this.printWinner(this.p2);
        }
      } else {
        this.printScoreBoard();
        this.play();
      }

    }
  }
}

const game = new RPS();
game.play();