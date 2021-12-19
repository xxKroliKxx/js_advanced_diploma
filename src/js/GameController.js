import themes from './themes';
import { generateTeam, characterGenerator } from './generators';
import * as Character from './Character';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';
import Team from './Team';

export function fillInXYCoordinates() {
  const coordinates = new Map();
  const fieldSize = 8;
  for (let indexX = 0; indexX < fieldSize; indexX += 1) {
    let index = fieldSize * (fieldSize - 1) + indexX;
    for (let indexY = 0; indexY < fieldSize; indexY += 1) {
      coordinates.set(index, { x: indexX, y: indexY });
      index -= fieldSize;
    }
  }
  return coordinates;
}

function getRandomInt(min, max) {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
}

function computerAttack(blueTeam, readTeam) {
  for (const positionRed of readTeam) {
    for (const positionBlue of blueTeam) {
      if (positionBlue.opportunityAttack(positionRed, this.coordinates)) {
        this.gamePlay.selectCell(positionRed.position);
        this.gamePlay.selectCell(positionBlue.position, 'red');
        setTimeout(
          () => {
            this.makeAttack(positionRed.character, positionBlue.character, positionBlue.position);
          },
          1000,
        );
        return true;
      }
    }
  }
  return false;
}

function availableCoordinates(attackerXY, rangeOfTravel, coordinates) {
  const arr = [];
  for (const e of coordinates) {
    const dx = Math.abs(attackerXY.x - e[1].x);
    const dy = Math.abs(attackerXY.y - e[1].y);
    if (dx <= rangeOfTravel
            && dy <= rangeOfTravel
            && (dx === dy || dx === 0 || dy === 0)) {
      arr.push(e[0]);
    }
  }
  return arr;
}

function position(startIndex) {
  const positions = [];
  for (const index of startIndex) {
    positions.push(index);
    let curPosition = index;
    for (let i = index; i < index + 7; i += 1) {
      curPosition += 8;
      positions.push(curPosition);
    }
  }
  return positions;
}

function nearestChampionship(blueTeam, readTeam) {
  const rnd = getRandomInt(0, readTeam.length);
  const redPosition = readTeam[rnd];
  let distance = new Map();
  let minDistance = Infinity;
  let attackerXY = this.coordinates.get(redPosition.position);

  for (const bluePosition of blueTeam) {
    const targetXY = this.coordinates.get(bluePosition.position);
    const dx = Math.abs(attackerXY.x - targetXY.x);
    const dy = Math.abs(attackerXY.y - targetXY.y);
    distance.set(dx + dy, bluePosition);
    minDistance = Math.min(minDistance, dx + dy);
  }

  const targetPosition = distance.get(minDistance);
  const targetXY = this.coordinates.get(targetPosition.position);
  this.gamePlay.selectCell(redPosition.position);

  const coordinates = availableCoordinates(
    attackerXY,
    redPosition.character.rangeOfTravel,
    this.coordinates,
  );
  minDistance = Infinity;
  distance = new Map();
  for (const index of coordinates) {
    if (this.gameState.getChampion(index) === undefined) {
      attackerXY = this.coordinates.get(index);
      const dx = Math.abs(attackerXY.x - targetXY.x);
      const dy = Math.abs(attackerXY.y - targetXY.y);
      distance.set(dx + dy, index);
      minDistance = Math.min(minDistance, dx + dy);
    }
  }

  const index = distance.get(minDistance);

  this.gamePlay.selectCell(index, 'green');
  this.gameState.selectedActionCell = index;

  setTimeout(
    () => {
      this.gameState.setNewPosition(redPosition.character, index);
      this.gamePlay.redrawPositions(this.gameState.characterPositions);
      this.clearCellSelection();
    },
    1000,
  );
}

export function actionIsAvailable(attacker, attackerIndex, targetIndex, action, coordinates) {
  if (attacker === undefined) {
    return false;
  }
  const attackerCoordinate = coordinates.get(attackerIndex);
  const targetCoordinate = coordinates.get(targetIndex);
  const dx = Math.abs(attackerCoordinate.x - targetCoordinate.x);
  const dy = Math.abs(attackerCoordinate.y - targetCoordinate.y);
  if (action === 'rangeOfTravel') {
    return dx <= attacker[action]
            && dy <= attacker[action]
            && (dx === dy || dx === 0 || dy === 0);
  } if (action === 'attackRange') {
    return dx <= attacker[action]
            && dy <= attacker[action];
  }
  return false;
}

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.coordinates = fillInXYCoordinates();
    this.thems = new Map([
      [1, themes.prairie],
      [2, themes.desert],
      [3, themes.arctic],
      [4, themes.mountain],
    ]);
  }

  init() {
    this.gamePlay.drawUi(this.thems.get(1));
    this.gamePlay.addNewGameListener((event) => this.newGame(event));
    this.gamePlay.addSaveGameListener((event) => this.saveGameListener(event));
    this.gamePlay.addLoadGameListener(() => {
      if (!this.loadGameListener()) {
        GamePlay.showError('упс');
      }
    });
    this.gamePlay.addCellEnterListener((event) => this.onCellEnter(event));
    this.gamePlay.addCellClickListener((event) => this.onCellClick(event));
  }

  newGame() {
    this.clearCellSelection();
    this.gamePlay.drawUi(this.thems.get(1));
    const blueTeam = generateTeam([Character.Bowman,
      Character.Swordsman,
      Character.Magician,
    ], 1, 2);
    const readTeam = generateTeam([Character.Undead, Character.Daemon], 1, 2);
    this.gameState.gameEnd = false;
    this.positionsNewGame(blueTeam, readTeam);
    this.gamePlay.redrawPositions(this.gameState.characterPositions);
  }

  saveGameListener() {
    this.stateService.save(this.gameState);
  }

  loadGameListener() {
    let gameInfo;
    try {
      gameInfo = this.stateService.load();
    } catch (e) {
      return false;
    }
    this.gameState.loadGame(gameInfo);
    this.clearCellSelection();
    this.gamePlay.drawUi(this.thems.get(this.gameState.lvl));
    this.gamePlay.redrawPositions(this.gameState.characterPositions);
    if (this.gameState.currentMove === 2) {
      this.computerRunning();
    }
    return true;
  }

  onCellClick(index) {
    if (this.gameState.gameEnd) {
      return;
    }

    const character = this.gameState.getChampion(index);
    const { currentCharacter } = this.gameState;

    if (character !== undefined && currentCharacter === character) {
      this.gameState.currentCharacter = undefined;
      this.gamePlay.deselectCell(this.gameState.getChampionIndex(currentCharacter));
      return;
    }

    if (character !== undefined && character.friendly) {
      this.gameState.currentCharacter = character;
      this.gamePlay.selectCell(index);
      if (currentCharacter !== undefined) {
        this.gamePlay.deselectCell(this.gameState.getChampionIndex(currentCharacter));
      }
      return;
    }

    const currentCharacterIndex = this.gameState.getChampionIndex(currentCharacter);

    let action = currentCharacter !== undefined && character === undefined;
    if (action && actionIsAvailable(currentCharacter, currentCharacterIndex, index, 'rangeOfTravel', this.coordinates)) {
      this.gameState.setNewPosition(currentCharacter, index);
      this.gamePlay.redrawPositions(this.gameState.characterPositions);
      this.gameState.currentMove = 2;
      this.clearCellSelection();
      this.computerRunning();
      return;
    }

    action = currentCharacter !== undefined && character !== undefined;
    if (action && actionIsAvailable(currentCharacter, currentCharacterIndex, index, 'attackRange', this.coordinates)) {
      this.gameState.currentMove = 2;
      this.makeAttack(currentCharacter, character, index);
      return;
    }

    GamePlay.showError('Не допустимое действие');
  }

  onCellEnter(index) {
    this.showCharacteristics(index);
    this.changeCursor(index);
  }

  clearCellSelection() {
    for (let index = 0; index < this.gamePlay.cells.length; index += 1) {
      const cell = this.gamePlay.cells[index];
      if (cell.classList.contains('selected')) {
        this.gamePlay.deselectCell(index);
      }
    }
  }

  makeAttack(attacker, target, index) {
    const damage = target.dealDamage(attacker);
    this.gamePlay.showDamage(index, damage).then(() => {
      this.gamePlay.redrawPositions(this.gameState.characterPositions);
      if (target.health === 0) {
        this.gameState.dellPosition(target);
        this.levelPassed();
        this.gamePlay.redrawPositions(this.gameState.characterPositions);
      }
      if (!this.gameState.gameEnd && this.gameState.currentMove === 2) {
        this.computerRunning();
      }
    });
    this.clearCellSelection();
    this.gameState.clearCurrentMove();
  }

  showCharacteristics(index) {
    // TODO: test
    const character = this.gameState.getChampion(index);
    if (character !== undefined) {
      this.gamePlay.showCellTooltip(character.stats(), index);
    }
  }

  changeCursor(index) {
    const { selectedActionCell } = this.gameState;
    if (selectedActionCell !== -1) {
      this.gamePlay.deselectCell(selectedActionCell);
    }

    if (this.gameState.gameEnd) {
      this.gamePlay.setCursor(cursors.notallowed);
      return;
    }

    const character = this.gameState.getChampion(index);
    if (character !== undefined && character.friendly) {
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }

    const { currentCharacter } = this.gameState;
    const currentCharacterIndex = this.gameState.getChampionIndex(currentCharacter);

    let action = currentCharacter !== undefined && character === undefined;
    if (action && actionIsAvailable(currentCharacter, currentCharacterIndex, index, 'rangeOfTravel', this.coordinates)) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
      this.gameState.selectedActionCell = index;
      return;
    }

    action = currentCharacter !== undefined && character !== undefined;
    if (action && !character.friendly && actionIsAvailable(currentCharacter, currentCharacterIndex, index, 'attackRange', this.coordinates)) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'red');
      this.gameState.selectedActionCell = index;
      return;
    }

    if (currentCharacter !== undefined) {
      this.gamePlay.setCursor(cursors.notallowed);
      return;
    }

    this.gamePlay.setCursor(cursors.auto);
  }

  levelPassed() {
    let blueWin = true;
    let redWin = true;
    for (const e of this.gameState.characterPositions) {
      if (e.character.friendly) redWin = false;
      if (!e.character.friendly) blueWin = false;
    }
    if (!redWin && !blueWin) return;

    if (redWin) {
      this.gameState.gameEnd = true;
      return;
    }

    this.gameState.setGameResult();

    if (this.gameState.lvl === 4) {
      this.gameState.gameEnd = true;
      this.gameState.saveGameResult();
      return;
    }

    this.gameState.lvl += 1;
    const blueTeam = new Team();
    for (const e of this.gameState.characterPositions) {
      blueTeam.addCharacter(e.character);
      e.character.lvlUP();
    }

    this.gamePlay.drawUi(this.thems.get(this.gameState.lvl));

    let availableClasses = [Character.Bowman, Character.Swordsman, Character.Magician];
    const newCharacter = characterGenerator(availableClasses, 1);
    blueTeam.addCharacter(newCharacter);

    availableClasses = [Character.Undead, Character.Daemon, Character.Vampire];
    const readTeam = generateTeam(availableClasses, this.gameState.lvl, blueTeam.characters.length);
    this.positionsNewGame(blueTeam, readTeam);
  }

  computerRunning() {
    this.gameState.currentMove = 1;

    const blueTeam = [];
    const readTeam = [];
    for (const e of this.gameState.characterPositions) {
      if (e.character.friendly) {
        blueTeam.push(e);
      } else readTeam.push(e);
    }

    if (computerAttack.call(this, blueTeam, readTeam)) {
      return;
    }

    nearestChampionship.call(this, blueTeam, readTeam);
  }

  positionsNewGame(blueTeam, readTeam) {
    const blueBoardPosition = position([0, 1]);
    const readBoardPosition = position([6, 7]);

    const positionArr = [];
    for (let i = 0; i < blueTeam.characters.length; i += 1) {
      let rnd = getRandomInt(0, blueBoardPosition.length);
      let index = blueBoardPosition[rnd];
      const bluePosition = new PositionedCharacter(blueTeam.getCharacter(i), index);
      blueBoardPosition.splice(rnd, 1);

      rnd = getRandomInt(0, readBoardPosition.length);
      index = readBoardPosition[rnd];
      const readPosition = new PositionedCharacter(readTeam.getCharacter(i), index);
      readBoardPosition.splice(rnd, 1);

      positionArr.push(bluePosition);
      positionArr.push(readPosition);
    }
    this.gameState.characterPositions = positionArr;
  }
}
