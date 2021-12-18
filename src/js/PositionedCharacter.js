import Character from './Character';

export default class PositionedCharacter {
    constructor(character, position) {
        if (!(character instanceof Character)) {
            throw new Error('character must be instance of Character or its children');
        }

        if (typeof position !== 'number') {
            throw new Error('position must be a number');
        }

        this.character = character;
        this.position = position;
    }

    opportunityAttack(attacker, coordinates) {
        const attackerXY = coordinates.get(attacker.position)
        const targetXY = coordinates.get(this.position)

        let dx = Math.abs(attackerXY.x - targetXY.x)
        let dy = Math.abs(attackerXY.y - targetXY.y)
        return dx <= attacker.character.attackRange &&
            dy <= attacker.character.attackRange
    }
}
