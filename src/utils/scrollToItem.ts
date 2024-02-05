import { scroller } from 'react-scroll';

import getPageHeaderHeight from './getPageHeaderHeight';
import {
  setFocusToFirstFocusable,
  setFocusToLastFocusable,
} from './setFocusToElement';

export const scrollToItem = (
  id: string,
  options?: { last?: boolean }
): void => {
  const offset = 24;
  const duration = 300;

  scroller.scrollTo(id, {
    delay: 50,
    duration,
    offset: 0 - (getPageHeaderHeight() + offset),
    smooth: true,
  });

  setTimeout(
    () =>
      options?.last
        ? setFocusToLastFocusable(id)
        : setFocusToFirstFocusable(id),
    duration
  );
};
