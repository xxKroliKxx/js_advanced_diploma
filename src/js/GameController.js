import themes from "./themes";
import {generateTeam, characterGenerator} from "./generators";
import * as Character from "./Character";
import PositionedCharacter from "./PositionedCharacter"
import GameState from "./GameState"
import GamePlay from "./GamePlay"
import cursors from "./cursors";
import Team from "./Team";

export default class GameController {
    constructor(gamePlay, stateService) {
        this.gamePlay = gamePlay;
        this.stateService = stateService;
        this.gameState = new GameState()
        this.coordinates = fillInXYCoordinates()
        this.thems = new Map([
            [1, themes.prairie],
            [2, themes.desert],
            [3, themes.arctic],
            [4, themes.mountain]
        ]);
    }

    init() {
        this.gamePlay.drawUi(this.thems.get(1))
        this.gamePlay.addNewGameListener(event => this.newGame(event))
        this.gamePlay.addCellEnterListener(event => this.onCellEnter(event))
        this.gamePlay.addCellLeaveListener(event => this.onCellLeave(event))
        this.gamePlay.addCellClickListener(event => this.onCellClick(event))

    }

    newGame(event) {
        this.clearCellSelection()
        let blueTeam = generateTeam([Character.Bowman, Character.Swordsman], 1, 2)
        let readTeam = generateTeam([Character.Undead, Character.Daemon], 1, 2)
        this.positionsNewGame(blueTeam, readTeam)
        this.gamePlay.redrawPositions(this.gameState.characterPositions)
    }

    onCellClick(index) {
        let character = this.gameState.getChampion(index)
        let currentCharacter = this.gameState.currentCharacter;

        if (character != undefined && currentCharacter === character) {
            this.gameState.currentCharacter = undefined;
            this.gamePlay.deselectCell(this.gameState.getChampionIndex(currentCharacter));
            return;
        }

        if (character != undefined && character.friendly) {
            this.gameState.currentCharacter = character;
            this.gamePlay.selectCell(index);
            if (currentCharacter != undefined) {
                this.gamePlay.deselectCell(this.gameState.getChampionIndex(currentCharacter));
            }
            return;
        }

        let action = currentCharacter != undefined && character === undefined;
        if (action && this.actionIsAvailable(index, 'rangeOfTravel')) {
            this.gameState.setNewPosition(currentCharacter, index);
            this.gamePlay.redrawPositions(this.gameState.characterPositions);
            this.gameState.currentMove = 2;
            this.clearCellSelection()
            this.computerRunning();
            return;
        }

        action = currentCharacter != undefined && character != undefined
        if (action && this.actionIsAvailable(index, 'attackRange')) {
            this.gameState.currentMove = 2;
            this.makeAttack(currentCharacter, character, index)
            return;
        }

        GamePlay.showError('Не допустимое действие')
    }

    onCellEnter(index) {
        this.showCharacteristics(index)
        this.changeCursor(index)
    }

    onCellLeave(index) {

    }

    clearCellSelection() {
        for (let index = 0; index < this.gamePlay.cells.length; index++) {
            const cell = this.gamePlay.cells[index]
            if (cell.classList.contains('selected')) {
                this.gamePlay.deselectCell(index)
            }
        }
    }

    makeAttack(attacker, target, index) {
        let damage = target.dealDamage(attacker)
        this.gamePlay.showDamage(index, damage).then(() => {
            this.gamePlay.redrawPositions(this.gameState.characterPositions);
            if (target.health === 0) {
                this.gameState.dellPosition(target);
                this.levelPassed();
                this.gamePlay.redrawPositions(this.gameState.characterPositions);
            }
            if (this.gameState.currentMove === 2) {
                this.computerRunning();
            }
        });
        this.clearCellSelection();
        this.gameState.clearCurrentMove();
    }

    showCharacteristics(index) {
        // TODO: test
        let character = this.gameState.getChampion(index)
        if (character != undefined) {
            let s = `\u{1F396}${character.level} \u{2694} ${character.attack} \u{1F6E1} ${character.defence} \u{2764} ${character.health}`
            this.gamePlay.showCellTooltip(s, index)
        }
    }

    changeCursor(index) {
        let selectedActionCell = this.gameState.selectedActionCell;
        if (selectedActionCell != -1) {
            this.gamePlay.deselectCell(selectedActionCell)
        }

        let character = this.gameState.getChampion(index)
        if (character != undefined && character.friendly) {
            this.gamePlay.setCursor(cursors.pointer)
            return
        }

        let currentCharacter = this.gameState.currentCharacter

        let action = currentCharacter != undefined && character === undefined;
        if (action && this.actionIsAvailable(index, 'rangeOfTravel')) {
            this.gamePlay.setCursor(cursors.pointer)
            this.gamePlay.selectCell(index, 'green')
            this.gameState.selectedActionCell = index
            return;
        }

        action = currentCharacter != undefined && character != undefined
        if (action && !character.friendly && this.actionIsAvailable(index, 'attackRange')) {
            this.gamePlay.setCursor(cursors.pointer)
            this.gamePlay.selectCell(index, 'red')
            this.gameState.selectedActionCell = index
            return;
        }

        if (currentCharacter != undefined) {
            this.gamePlay.setCursor(cursors.notallowed)
            return;
        }

        this.gamePlay.setCursor(cursors.auto)
    }

    actionIsAvailable(index, action) {
        let character = this.gameState.currentCharacter
        if (character === undefined) {
            return false
        }
        const CharacterIndex = this.gameState.getChampionIndex(character)
        let characterCoordinate = this.coordinates.get(CharacterIndex)
        let indexCoordinate = this.coordinates.get(index)
        let dx = Math.abs(characterCoordinate.x - indexCoordinate.x)
        let dy = Math.abs(characterCoordinate.y - indexCoordinate.y)
        if (action === 'rangeOfTravel') {
            return dx <= character[action] &&
                dy <= character[action] &&
                (dx === dy || dx === 0 || dy === 0)

        } else if (action === 'attackRange') {
            return dx <= character[action] &&
                dy <= character[action]
        }
        return false
    }

    levelPassed() {
        let blueWin = true
        let redWin = true
        for (const e of this.gameState.characterPositions) {
            if (e.character.friendly) redWin = false
            if (!e.character.friendly) blueWin = false
        }
        if (!redWin && !blueWin) return

        if (redWin) {

        }

        if (this.gameState.lvl === 4) {
            // заблокировать экран
        }

        this.gameState.lvl += 1
        let blueTeam = new Team()
        for (const e of this.gameState.characterPositions) {
            blueTeam.addCharacter(e.character)
            e.character.lvlUP()
        }

        this.gamePlay.drawUi(this.thems.get(this.gameState.lvl))

        let availableClasses = [Character.Bowman, Character.Swordsman, Character.Magician]
        let newCharacter = characterGenerator(availableClasses, 1)
        blueTeam.addCharacter(newCharacter)

        availableClasses = [Character.Undead, Character.Daemon, Character.Vampire]
        let readTeam = generateTeam(availableClasses, this.gameState.lvl, blueTeam.characters.length)
        this.positionsNewGame(blueTeam, readTeam)
    }

    computerRunning() {
        this.gameState.currentMove = 1;

        let blueTeam = []
        let readTeam = []
        for (let e of this.gameState.characterPositions) {
            if (e.character.friendly) {
                blueTeam.push(e)
            } else readTeam.push(e)
        }

        if (computerAttack.call(this, blueTeam, readTeam)) {
            return;
        }

        nearestChampionship.call(this, blueTeam, readTeam)
    }

    positionsNewGame(blueTeam, readTeam) {
        let blueBoardPosition = position([0, 1])
        let readBoardPosition = position([6, 7])

        let positionArr = []
        for (let i = 0; i < blueTeam.characters.length; i++) {
            let rnd = getRandomInt(0, blueBoardPosition.length)
            let index = blueBoardPosition[rnd]
            let bluePosition = new PositionedCharacter(blueTeam.getCharacter(i), index)
            blueBoardPosition.splice(rnd, 1)

            rnd = getRandomInt(0, readBoardPosition.length)
            index = readBoardPosition[rnd]
            let readPosition = new PositionedCharacter(readTeam.getCharacter(i), index)
            readBoardPosition.splice(rnd, 1)

            positionArr.push(bluePosition)
            positionArr.push(readPosition)
        }
        this.gameState.characterPositions = positionArr
    }

}


function position(startIndex) {
    let positions = []
    for (let index of startIndex) {
        positions.push(index)
        let position = index
        for (let i = index; i < index + 7; i++) {
            position += 8
            positions.push(position)
        }
    }
    return positions
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function fillInXYCoordinates() {
    let coordinates = new Map
    const fieldSize = 8
    for (let indexX = 0; indexX < fieldSize; indexX++) {
        let index = fieldSize * (fieldSize - 1) + indexX
        for (let indexY = 0; indexY < fieldSize; indexY++) {
            coordinates.set(index, {x: indexX, y: indexY})
            index -= fieldSize
        }
    }
    return coordinates
}

function computerAttack(blueTeam, readTeam) {
    for (let positionRed of readTeam) {
        for (let positionBlue of blueTeam) {
            if (positionBlue.opportunityAttack(positionRed, this.coordinates)) {
                this.gamePlay.selectCell(positionRed.position);
                this.gamePlay.selectCell(positionBlue.position, 'red')
                setTimeout(() => {
                        this.makeAttack(positionRed.character, positionBlue.character, positionBlue.position)
                    },
                    1000
                )
                return true
            }
        }
    }
    return false
}

function nearestChampionship(blueTeam, readTeam) {
    let rnd = getRandomInt(0, readTeam.length)
    let redPosition = readTeam[rnd]
    let distance = new Map;
    let minDistance = Infinity
    const attackerXY = this.coordinates.get(redPosition.position)

    for (let bluePosition of blueTeam) {
        const targetXY = this.coordinates.get(bluePosition.position)
        let dx = Math.abs(attackerXY.x - targetXY.x)
        let dy = Math.abs(attackerXY.y - targetXY.y)
        distance.set(dx + dy, bluePosition)
        minDistance = Math.min(minDistance, dx + dy)
    }

    let targetPosition = distance.get(minDistance)
    let targetXY = this.coordinates.get(targetPosition.position)
    this.gamePlay.selectCell(redPosition.position);

    let coordinates = availableCoordinates(attackerXY, redPosition.character.rangeOfTravel, this.coordinates)
    minDistance = Infinity
    distance = new Map;
    for (let index of coordinates) {
        if (this.gameState.getChampion(index) != undefined) continue

        let attackerXY = this.coordinates.get(index)
        let dx = Math.abs(attackerXY.x - targetXY.x)
        let dy = Math.abs(attackerXY.y - targetXY.y)
        distance.set(dx + dy, index)
        minDistance = Math.min(minDistance, dx + dy)

    }

    let index = distance.get(minDistance)

    this.gamePlay.selectCell(index, 'green')
    this.gameState.selectedActionCell = index

    setTimeout(() => {
            this.gameState.setNewPosition(redPosition.character, index);
            this.gamePlay.redrawPositions(this.gameState.characterPositions);
            this.clearCellSelection();
        },
        1000
    );
}

function availableCoordinates(attackerXY, rangeOfTravel, coordinates) {
    let availableCoordinates = []
    for (let e of coordinates) {
        let dx = Math.abs(attackerXY.x - e[1].x)
        let dy = Math.abs(attackerXY.y - e[1].y)
        if (dx <= rangeOfTravel &&
            dy <= rangeOfTravel &&
            (dx === dy || dx === 0 || dy === 0)) {
            availableCoordinates.push(e[0])
        }
    }
    return availableCoordinates
}