import { TEST_NOCACHE_TIME } from '../constants';
import isTestEnv from './isTestEnv';

const getNocacheTime = (): number =>
  isTestEnv ? TEST_NOCACHE_TIME : Date.now();

export default getNocacheTime;
