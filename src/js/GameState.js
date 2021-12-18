import PositionedCharacter from "./PositionedCharacter";

export default class GameState {

    constructor() {
        this.characterPositions = []
        this.currentMove = 1
        this.currentCharacter = undefined
        this.selectedActionCell = -1
        this.lvl = 1
        this.rating = 0
    }

    static from(object) {
        return null;
    }

    getChampion(index) {
        let position = this.characterPositions.find(element => {
            if (element.position === index) return element
        })
        return position === undefined ? undefined : position.character
    }

    getChampionIndex(character) {
        let positionedCharacter = this.characterPositions.find(element => {
            if (element.character === character) return true
        })
        return positionedCharacter === undefined ? -1 : positionedCharacter.position
    }

    setNewPosition(character, index) {
        let positionedCharacter = this.characterPositions.find(element => {
            if (element.character === character) return true
        })
        positionedCharacter.position = index;
        this.clearCurrentMove()
    }

    dellPosition(character) {
        let index = this.characterPositions.findIndex((element, index) => {
            if (element.character === character) return true
        })
        this.characterPositions.splice(index, 1)
        this.clearCurrentMove()
    }

    clearCurrentMove() {
        this.currentCharacter = undefined;
        this.selectedActionCell = -1;
    }
}