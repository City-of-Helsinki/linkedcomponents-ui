import { scroller } from 'react-scroll';

import getPageHeaderHeight from './getPageHeaderHeight';
import setFocusToFirstFocusable from './setFocusToFirstFocusable';

export const scrollToItem = (id: string): void => {
  const offset = 24;
  const duration = 300;

  scroller.scrollTo(id, {
    delay: 50,
    duration,
    offset: 0 - (getPageHeaderHeight() + offset),
    smooth: true,
  });

  setTimeout(() => setFocusToFirstFocusable(id), duration);
};
