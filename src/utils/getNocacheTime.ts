import getUnixTime from 'date-fns/getUnixTime';

import { TEST_NOCACHE_TIME } from '../constants';
import isTestEnv from './isTestEnv';

const getNocacheTime = (): number =>
  isTestEnv ? TEST_NOCACHE_TIME : getUnixTime(new Date());

export default getNocacheTime;
