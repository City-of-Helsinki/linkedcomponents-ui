/* eslint @typescript-eslint/explicit-function-return-type: 0 */
import { useContext } from 'react';

import { PageSettingsContext } from '../pageSettingsContext/PageSettingsContext';
import { PageSettingsContextProps } from '../types';

export const usePageSettings = (): PageSettingsContextProps => {
  const context = useContext<PageSettingsContextProps | undefined>(
    PageSettingsContext
  );

  if (!context) {
    throw new Error(
      // eslint-disable-next-line max-len
      'PageSettings context is undefined, please verify you are calling usePageSettings() as child of a <PageSettingsProvider> component.'
    );
  }

  return context;
};
