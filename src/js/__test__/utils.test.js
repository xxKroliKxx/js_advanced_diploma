import { calcTileType } from '../utils';

test('top-left', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
});

test('top-right', () => {
  expect(calcTileType(7, 8)).toBe('top-right');
});

test('top', () => {
  expect(calcTileType(3, 8)).toBe('top');
});

test('bottom-left', () => {
  expect(calcTileType(56, 8)).toBe('bottom-left');
});

test('bottom-right', () => {
  expect(calcTileType(63, 8)).toBe('bottom-right');
});

test('bottom', () => {
  expect(calcTileType(59, 8)).toBe('bottom');
});

test('left', () => {
  expect(calcTileType(24, 8)).toBe('left');
});

test('right', () => {
  expect(calcTileType(31, 8)).toBe('right');
});

test('center', () => {
  expect(calcTileType(19, 8)).toBe('center');
});
