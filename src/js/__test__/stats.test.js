import { Bowman } from '../Character';

test('stats info', () => {
  const character = new Bowman(4, 100, 100, 100);
  expect(character.stats()).toBe('\u{1F396}4 \u{2694} 100 \u{1F6E1} 100 \u{2764} 100');
});
