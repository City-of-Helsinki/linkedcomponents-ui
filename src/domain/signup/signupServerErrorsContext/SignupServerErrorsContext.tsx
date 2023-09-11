/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError, ServerError } from '@apollo/client';
import React, { FC, PropsWithChildren, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ServerErrorItem } from '../../../types';
import {
  parseSeatsReservationServerErrors,
  parseSignupGroupServerErrors,
} from './utils';

type ShowServerErrorsFnParams = {
  error: any;
};

type RequestType = 'signup' | 'seatsReservation';

export type SignupServerErrorsContextProps = {
  serverErrorItems: ServerErrorItem[];
  setServerErrorItems: (items: ServerErrorItem[]) => void;
  showServerErrors: (
    params: ShowServerErrorsFnParams,
    type: RequestType
  ) => void;
};

export const SignupServerErrorsContext = React.createContext<
  SignupServerErrorsContextProps | undefined
>(undefined);

export const SignupServerErrorsProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { t } = useTranslation();

  const [serverErrorItems, setServerErrorItems] = React.useState<
    ServerErrorItem[]
  >([]);

  const showServerErrors = useCallback(
    ({ error }: ShowServerErrorsFnParams, type: RequestType) => {
      /* istanbul ignore else */
      if (error instanceof ApolloError) {
        const { networkError } = error;
        const { result } = networkError as ServerError;

        /* istanbul ignore else */
        if (result) {
          if (type === 'signup') {
            setServerErrorItems(parseSignupGroupServerErrors({ result, t }));
          } else {
            setServerErrorItems(
              parseSeatsReservationServerErrors({ result, t })
            );
          }
        }
      }
    },
    [t]
  );

  const value = useMemo(
    () => ({
      serverErrorItems,
      setServerErrorItems,
      showServerErrors,
    }),
    [serverErrorItems, showServerErrors]
  );
  return (
    <SignupServerErrorsContext.Provider value={value}>
      {children}
    </SignupServerErrorsContext.Provider>
  );
};
