/* eslint @typescript-eslint/explicit-function-return-type: 0 */
import { useContext } from 'react';

import {
  SignupServerErrorsContext,
  SignupServerErrorsContextProps,
} from '../SignupServerErrorsContext';

export const useSignupServerErrorsContext =
  (): SignupServerErrorsContextProps => {
    const context = useContext<SignupServerErrorsContextProps | undefined>(
      SignupServerErrorsContext
    );

    /* istanbul ignore next */
    if (!context) {
      throw new Error(
        // eslint-disable-next-line max-len
        'SignupServerErrorsContext context is undefined, please verify you are calling useSignupServerErrorsContext() as child of a <SignupServerErrorsProvider> component.'
      );
    }

    return context;
  };
