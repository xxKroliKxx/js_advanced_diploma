import { actionIsAvailable, fillInXYCoordinates } from '../GameController';
import { Bowman } from '../Character';

const coordinates = fillInXYCoordinates();
const character = new Bowman(1);

test('action attack true', () => {
  expect(
    actionIsAvailable(character, 0, 2, 'attackRange', coordinates),
  ).toEqual(true);
});

test('action attack false', () => {
  expect(
    actionIsAvailable(character, 0, 4, 'attackRange', coordinates),
  ).toEqual(false);
});

test('action travel true', () => {
  expect(
    actionIsAvailable(character, 0, 2, 'rangeOfTravel', coordinates),
  ).toEqual(true);
});

test('action travel false', () => {
  expect(
    actionIsAvailable(character, 0, 3, 'rangeOfTravel', coordinates),
  ).toEqual(false);
});

test('action attacker undefined', () => {
  expect(
    actionIsAvailable(undefined, 0, 3, 'rangeOfTravel', coordinates),
  ).toEqual(false);
});
