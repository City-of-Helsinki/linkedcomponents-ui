/* eslint @typescript-eslint/explicit-function-return-type: 0 */
import { useContext } from 'react';

import {
  TimeSectionContext,
  TimeSectionContextProps,
} from '../TimeSectionContext';

const useTimeSectionContext = (): TimeSectionContextProps => {
  const context = useContext<TimeSectionContextProps | undefined>(
    TimeSectionContext
  );

  if (!context) {
    throw new Error(
      // eslint-disable-next-line max-len
      'TimeSectionProvider context is undefined, please verify you are calling useTimeSectionContext() as child of a <TimeSectionProvider> component.'
    );
  }

  return context;
};

export default useTimeSectionContext;
