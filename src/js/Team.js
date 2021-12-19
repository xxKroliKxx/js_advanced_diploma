export default class Team {
  constructor() {
    this.characters = [];
  }

  addCharacter(character) {
    this.characters.push(character);
  }

  getCharacter(index) {
    return this.characters[index];
  }
}
