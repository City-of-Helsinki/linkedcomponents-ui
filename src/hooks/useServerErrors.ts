/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError, ServerError } from '@apollo/client';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  LEServerError,
  ServerErrorItem,
  ShowServerErrorsFnParams,
  UseServerErrorsState,
} from '../types';

type ParseServerErrorFn = ({
  result,
  t,
}: {
  result: LEServerError;
  t: TFunction;
}) => ServerErrorItem[];

const useServerErrors = (
  parseServerErrorFn: ParseServerErrorFn
): UseServerErrorsState => {
  const { t } = useTranslation();
  const [serverErrorItems, setServerErrorItems] = React.useState<
    ServerErrorItem[]
  >([]);

  const showServerErrors = ({
    callbackFn,
    error,
  }: ShowServerErrorsFnParams) => {
    /* istanbul ignore else */
    if (error instanceof ApolloError) {
      const { networkError } = error;
      const { result } = networkError as ServerError;

      /* istanbul ignore else */
      if (result) {
        setServerErrorItems(parseServerErrorFn({ result, t }));
        callbackFn && callbackFn();
      }
    }
  };

  return { serverErrorItems, setServerErrorItems, showServerErrors };
};

export default useServerErrors;
