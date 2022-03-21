/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError, ServerError } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  ServerErrorItem,
  ShowServerErrorsFnParams,
  UseServerErrorsState,
} from '../../../types';
import { parseOrganizationServerErrors } from './utils';

const useOrganizationServerErrors = (): UseServerErrorsState => {
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
        setServerErrorItems(parseOrganizationServerErrors({ result, t }));
        callbackFn && callbackFn();
      }
    }
  };

  return { serverErrorItems, setServerErrorItems, showServerErrors };
};

export default useOrganizationServerErrors;
