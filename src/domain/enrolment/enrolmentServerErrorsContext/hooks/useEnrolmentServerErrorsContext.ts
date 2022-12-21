/* eslint @typescript-eslint/explicit-function-return-type: 0 */
import { useContext } from 'react';

import {
  EnrolmentServerErrorsContext,
  EnrolmentServerErrorsContextProps,
} from '../EnrolmentServerErrorsContext';

export const useEnrolmentServerErrorsContext =
  (): EnrolmentServerErrorsContextProps => {
    const context = useContext<EnrolmentServerErrorsContextProps | undefined>(
      EnrolmentServerErrorsContext
    );

    /* istanbul ignore next */
    if (!context) {
      throw new Error(
        // eslint-disable-next-line max-len
        'EnrolmentServerErrorsContext context is undefined, please verify you are calling useEnrolmentServerErrorsContext() as child of a <EnrolmentServerErrorsProvider> component.'
      );
    }

    return context;
  };
