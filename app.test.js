import RPS from './app.js';

const rps = new RPS();

// Bot Alicia

describe('Bot Alicia', () => {

  it('should return the correct move in rps.logic movepool', () => {
    const moves = Object.keys(rps.logic);
    expect(moves).toContain(rps.botAliciaMove())
  })
});

// Game Logic

describe('Game Logic', () => {

  it('should return true if the both players have the same move', () => {
    const tie = rps.isRoundTie('Rock', 'Rock');
    expect(tie).toBe(true);
  });

  it('should return false if the both players have different moves', () => {
    const tie = rps.isRoundTie('Paper', 'Rock');
    expect(tie).toBe(false);
  });

  it('should return true if Player One has the winning move', () => {
    const win = rps.isPlayerOneWinner('Rock', 'Scissors');
    expect(win).toBe(true);
  });

  it('should return false if Player One has the losing move', () => {
    const lose = rps.isPlayerOneWinner('Scissors', 'Rock');
    expect(lose).toBe(false);
  });

  it('should return true if the winning Player of a round has won the game', () => {
    rps.score = {
      rounds: 5,
      currentRound: 10,
      'Jae': 3,
      'Bot Alicia': 1
    }

    const winner = rps.isWinner('Jae');
    expect(winner).toBe(true);
  });

  it('should return false if the winning Player of a round hasnt won yet', () => {
    rps.score = {
      rounds: 5,
      currentRound: 10,
      'Jae': 2,
      'Bot Alicia': 1
    }

    const notWinner = rps.isWinner('Jae');
    expect(notWinner).toBe(false);
  });

  it('should add infomation of a round to the scordBoard', () => {
    const scoreboardSize = rps.scoreBoard.length;
    rps.recordMove('Rock', 'Paper', 'Bot Alicia Wins!');
    expect(rps.scoreBoard.length > scoreboardSize).toBe(true);
  });

  it('should increment currentRound for the next record on Scorboard', () => {
    const currentRound = rps.score.currentRound;
    rps.recordMove('Rock', 'Paper', 'Bot Alicia Wins!');
    expect(rps.score.currentRound > currentRound).toBe(true);
  });

});
