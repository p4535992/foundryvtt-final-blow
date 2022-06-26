import CONSTANTS from './constants';
import API from './api';
import { debug } from './lib/lib';
import { setSocket } from '../final-blow';

export let finalBlowSocket;

export function registerSocket() {
  debug('Registered finalBlowSocket');
  if (finalBlowSocket) {
    return finalBlowSocket;
  }
  //@ts-ignore
  finalBlowSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

  setSocket(finalBlowSocket);
  return finalBlowSocket;
}
