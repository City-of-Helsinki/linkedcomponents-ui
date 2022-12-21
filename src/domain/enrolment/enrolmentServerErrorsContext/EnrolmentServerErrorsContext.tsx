/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError, ServerError } from '@apollo/client';
import React, { FC, PropsWithChildren } from 'react';
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

  const showServerErrors = (
    { error }: ShowServerErrorsFnParams,
    type: RequestType
  ) => {
    /* istanbul ignore else */
    if (error instanceof ApolloError) {
      const { networkError } = error;
      const { result } = networkError as ServerError;

      /* istanbul ignore else */
      if (result) {
        switch (type) {
          case 'enrolment':
            setServerErrorItems(parseEnrolmentServerErrors({ result, t }));
            break;
          case 'seatsReservation':
            setServerErrorItems(
              parseSeatsReservationServerErrors({ result, t })
            );
            break;
        }
      }
    }
  };

  return (
    <EnrolmentServerErrorsContext.Provider
      value={{
        serverErrorItems,
        setServerErrorItems,
        showServerErrors,
      }}
    >
      {children}
    </EnrolmentServerErrorsContext.Provider>
  );
};
