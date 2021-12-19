import Character from '../Character';

test('character creation', () => {
  expect(() => {
    new Character(100, 'bowman', 100, 100, false); // eslint-disable-line  no-new
  }).toThrow(new Error('Creating a class is prohibited'));
});
