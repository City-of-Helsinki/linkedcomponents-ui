/* eslint @typescript-eslint/explicit-function-return-type: 0 */
import { useContext } from 'react';

import {
  ReservationTimerContext,
  ReservationTimerContextProps,
} from '../ReservationTimerContext';

export const useReservationTimer = (): ReservationTimerContextProps => {
  const context = useContext<ReservationTimerContextProps | undefined>(
    ReservationTimerContext
  );

  /* istanbul ignore next */
  if (!context) {
    throw new Error(
      // eslint-disable-next-line max-len
      'ReservationTimerProvider context is undefined, please verify you are calling useReservationTimer() as child of a <ReservationTimerProvider> component.'
    );
  }

  return context;
};
