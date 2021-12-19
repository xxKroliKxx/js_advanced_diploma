/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
import Team from './Team';

function getRandomInt(min, max) {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
}

export function characterGenerator(allowedTypes, maxLevel) {
  const rnd = getRandomInt(0, allowedTypes.length);
  return new allowedTypes[rnd](getRandomInt(1, maxLevel));
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = new Team();
  for (let i = 1; i <= characterCount; i += 1) {
    const character = characterGenerator(allowedTypes, maxLevel);
    team.addCharacter(character);
  }
  return team;
}
