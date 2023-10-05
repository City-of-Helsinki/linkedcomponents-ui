import { useLocation } from 'react-router';

import { reportError } from '../domain/app/sentry/utils';
import useUser from '../domain/user/hooks/useUser';
import { MutationCallbacks } from '../types';

type UseHandleErrorState<PayloadType, ObjectType> = {
  handleError: ({
    callbacks,
    error,
    message,
    object,
    payload,
    savingFinished,
  }: {
    callbacks?: MutationCallbacks;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: string;
    object?: ObjectType;
    payload?: PayloadType;
    savingFinished: () => void;
  }) => void;
};

function useHandleError<PayloadType, ObjectType>(): UseHandleErrorState<
  PayloadType,
  ObjectType
> {
  const { user } = useUser();
  const location = useLocation();

  const handleError = ({
    callbacks,
    error,
    message,
    object,
    payload,
    savingFinished,
  }: {
    callbacks?: MutationCallbacks;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: string;
    object?: ObjectType;
    payload?: PayloadType;
    savingFinished: () => void;
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        payloadAsString: payload && JSON.stringify(payload),
        object,
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  return { handleError };
}

export default useHandleError;
