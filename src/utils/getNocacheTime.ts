import getUnixTime from 'date-fns/getUnixTime';

import isTestEnv from './isTestEnv';
import { TEST_NOCACHE_TIME } from './testUtils';

const getNocacheTime = (): number =>
  isTestEnv ? TEST_NOCACHE_TIME : getUnixTime(new Date());

export default getNocacheTime;
