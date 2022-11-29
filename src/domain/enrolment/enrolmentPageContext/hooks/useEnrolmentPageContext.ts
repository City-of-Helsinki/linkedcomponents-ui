/* eslint @typescript-eslint/explicit-function-return-type: 0 */
import { useContext } from 'react';

import {
  EnrolmentPageContext,
  EnrolmentPageContextProps,
} from '../EnrolmentPageContext';

export const useEnrolmentPageContext = (): EnrolmentPageContextProps => {
  const context = useContext<EnrolmentPageContextProps | undefined>(
    EnrolmentPageContext
  );

  /* istanbul ignore next */
  if (!context) {
    throw new Error(
      // eslint-disable-next-line max-len
      'EnrolmentPageContext context is undefined, please verify you are calling useEnrolmentPageContext() as child of a <EnrolmentPageProvider> component.'
    );
  }

  return context;
};
