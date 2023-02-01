import { Dispatch, SetStateAction, useState } from 'react';
import { useLocation } from 'react-router';
import { scroller } from 'react-scroll';

import {
  FeedbackInput,
  usePostFeedbackMutation,
  usePostGuestFeedbackMutation,
} from '../../../generated/graphql';
import { MutationCallbacks } from '../../../types';
import { reportError } from '../../app/sentry/utils';
import { useAuth } from '../../auth/hooks/useAuth';

type UseFeedbackActionsProps = { successId: string };

type UseFeedbackActionsState = {
  setSuccess: Dispatch<SetStateAction<boolean>>;
  submitFeedback: (
    payload: FeedbackInput,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  success: boolean;
};
const useFeedbackActions = ({
  successId,
}: UseFeedbackActionsProps): UseFeedbackActionsState => {
  const location = useLocation();
  const { isAuthenticated: authenticated } = useAuth();

  const [success, setSuccess] = useState(false);

  const [postFeedback] = usePostFeedbackMutation();
  const [postGuestFeedback] = usePostGuestFeedbackMutation();

  const cleanAfterUpdate = async (callbacks?: MutationCallbacks) => {
    scroller.scrollTo(successId, {
      duration: 300,
      offset: -200,
      smooth: true,
    });
    setSuccess(true);

    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks?.onSuccess());
  };

  const handleError = ({
    callbacks,
    error,
    message,
    payload,
  }: {
    callbacks?: MutationCallbacks;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: string;
    payload: FeedbackInput;
  }) => {
    setSuccess(false);
    // Report error to Sentry
    reportError({
      data: {
        error: error as Record<string, unknown>,
        payload,
        payloadAsString: JSON.stringify(payload),
      },
      location,
      message,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const submitFeedback = async (
    payload: FeedbackInput,
    callbacks?: MutationCallbacks
  ) => {
    setSuccess(false);

    try {
      if (authenticated) {
        await postFeedback({ variables: { input: payload } });
      } else {
        await postGuestFeedback({ variables: { input: payload } });
      }

      cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to send feedback',
        payload,
      });
    }
  };
  return { setSuccess, submitFeedback, success };
};

export default useFeedbackActions;
