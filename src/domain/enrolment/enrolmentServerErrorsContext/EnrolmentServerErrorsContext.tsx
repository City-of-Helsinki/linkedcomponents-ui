/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError, ServerError } from '@apollo/client';
import React, { FC, PropsWithChildren, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ServerErrorItem } from '../../../types';
import {
  parseEnrolmentServerErrors,
  parseSeatsReservationServerErrors,
} from './utils';

type ShowServerErrorsFnParams = {
  error: any;
};

type RequestType = 'enrolment' | 'seatsReservation';

export type EnrolmentServerErrorsContextProps = {
  serverErrorItems: ServerErrorItem[];
  setServerErrorItems: (items: ServerErrorItem[]) => void;
  showServerErrors: (
    params: ShowServerErrorsFnParams,
    type: RequestType
  ) => void;
};

export const EnrolmentServerErrorsContext = React.createContext<
  EnrolmentServerErrorsContextProps | undefined
>(undefined);

export const EnrolmentServerErrorsProvider: FC<PropsWithChildren> = ({
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
          if (type === 'enrolment') {
            setServerErrorItems(parseEnrolmentServerErrors({ result, t }));
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
    <EnrolmentServerErrorsContext.Provider value={value}>
      {children}
    </EnrolmentServerErrorsContext.Provider>
  );
};
