/* eslint @typescript-eslint/explicit-function-return-type: 0 */
import { useContext } from 'react';

import {
  SignupGroupFormContext,
  SignupGroupFormContextProps,
} from '../SignupGroupFormContext';

export const useSignupGroupFormContext = (): SignupGroupFormContextProps => {
  const context = useContext<SignupGroupFormContextProps | undefined>(
    SignupGroupFormContext
  );

  /* istanbul ignore next */
  if (!context) {
    throw new Error(
      // eslint-disable-next-line max-len
      'SignupGroupFormContext context is undefined, please verify you are calling useSignupGroupFormContext() as child of a <SignupGroupFormProvider> component.'
    );
  }

  return context;
};
