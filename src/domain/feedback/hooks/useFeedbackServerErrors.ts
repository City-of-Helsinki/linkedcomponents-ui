/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError, ServerError } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ServerErrorItem } from '../../../types';
import { parseFeedbackServerErrors } from './utils';

type ShowServerErrorsFnParams = {
  callbackFn?: () => void;
  error: any;
};

type UseEventServerErrorsState = {
  serverErrorItems: ServerErrorItem[];
  setServerErrorItems: (items: ServerErrorItem[]) => void;
  showServerErrors: (params: ShowServerErrorsFnParams) => void;
};

const useFeedbackServerErrors = (): UseEventServerErrorsState => {
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
        setServerErrorItems(parseFeedbackServerErrors({ result, t }));

        callbackFn && callbackFn();
      }
    }
  };

  return { serverErrorItems, setServerErrorItems, showServerErrors };
};

export default useFeedbackServerErrors;
