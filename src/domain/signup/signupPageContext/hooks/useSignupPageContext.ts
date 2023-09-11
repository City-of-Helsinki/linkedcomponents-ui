/* eslint @typescript-eslint/explicit-function-return-type: 0 */
import { useContext } from 'react';

import {
  SignupPageContext,
  SignupPageContextProps,
} from '../SignupPageContext';

export const useSignupPageContext = (): SignupPageContextProps => {
  const context = useContext<SignupPageContextProps | undefined>(
    SignupPageContext
  );

  /* istanbul ignore next */
  if (!context) {
    throw new Error(
      // eslint-disable-next-line max-len
      'SignupPageContext context is undefined, please verify you are calling useSignupPageContext() as child of a <SignupPageProvider> component.'
    );
  }

  return context;
};
