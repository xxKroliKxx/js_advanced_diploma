/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
import Team from './Team';

export function characterGenerator(allowedTypes, maxLevel) {
    let rnd = getRandomInt(0, allowedTypes.length)
    return new allowedTypes[rnd]( getRandomInt(1, maxLevel))
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
    let team = new Team()
    for (let i = 1; i <= characterCount; i++) {
        let character = characterGenerator(allowedTypes, maxLevel)
        team.addCharacter(character)
    }
    return team
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}