import GameController from '../GameController';
import GameStateService from '../GameStateService';

jest.mock('../GameStateService');

test('action attack true', () => {
  const stateService = new GameStateService();
  stateService.load.mockImplementation(() => { throw new Error(); });
  const gameCtrl = new GameController(undefined, stateService);
  expect(gameCtrl.loadGameListener()).toEqual(false);
});
