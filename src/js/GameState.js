import * as Character from './Character';
import PositionedCharacter from './PositionedCharacter';

export default class GameState {
  constructor() {
    this.characterPositions = [];
    this.currentMove = 1;
    this.currentPoin = 0;
    this.currentCharacter = undefined;
    this.selectedActionCell = -1;
    this.lvl = 1;
    this.rating = 0;
    this.gameEnd = false;
    this.gameResults = [];
  }

  getChampion(index) {
    const position = this.characterPositions.find((element) => {
      if (element.position === index) {
        return true;
      } return false;
    });
    return position === undefined ? undefined : position.character;
  }

  getChampionIndex(character) {
    const positionedCharacter = this.characterPositions.find((element) => {
      if (element.character === character) {
        return true;
      } return false;
    });
    return positionedCharacter === undefined ? -1 : positionedCharacter.position;
  }

  setNewPosition(character, index) {
    const positionedCharacter = this.characterPositions.find((element) => {
      if (element.character === character) {
        return true;
      } return false;
    });
    positionedCharacter.position = index;
    this.clearCurrentMove();
  }

  dellPosition(character) {
    const index = this.characterPositions.findIndex((element) => {
      if (element.character === character) {
        return true;
      } return false;
    });
    this.characterPositions.splice(index, 1);
    this.clearCurrentMove();
  }

  clearCurrentMove() {
    this.currentCharacter = undefined;
    this.selectedActionCell = -1;
  }

  setGameResult() {
    let points = 0;
    for (const position of this.characterPositions) {
      points += position.character.health;
    }
    this.currentPoin += points;
  }

  saveGameResult() {
    this.gameResults.push(this.currentPoin);
  }

  loadGame(gameInfo) {
    this.characterPositions = [];
    for (const e of gameInfo.characterPositions) {
      const characterObj = e.character;
      let CharacterClass = Character.default;
      switch (characterObj.type) {
        case 'bowman':
          CharacterClass = Character.Bowman;
          break;
        case 'swordsman':
          CharacterClass = Character.Swordsman;
          break;
        case 'magician':
          CharacterClass = Character.Magician;
          break;
        case 'vampire':
          CharacterClass = Character.Vampire;
          break;
        case 'undead':
          CharacterClass = Character.Undead;
          break;
        case 'daemon':
          CharacterClass = Character.Daemon;
          break;
        default:
          CharacterClass = Character.default;
      }
      const character = new CharacterClass(
        characterObj.level,
        characterObj.health,
        characterObj.attack,
        characterObj.defence,
        characterObj.criticalAttackChance,
        characterObj.criticalDamage,
      );
      this.characterPositions.push(new PositionedCharacter(character, e.position));
    }
    this.currentMove = gameInfo.currentMove;
    this.currentPoin = gameInfo.currentPoin;
    this.gameEnd = gameInfo.gameEnd;
    this.lvl = gameInfo.lvl;
    this.rating = gameInfo.rating;
    this.gameResults = gameInfo.gameResults;
  }
}
