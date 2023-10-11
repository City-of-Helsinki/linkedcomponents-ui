import { Dispatch, SetStateAction, useState } from 'react';
import { scroller } from 'react-scroll';

import {
  FeedbackInput,
  usePostFeedbackMutation,
  usePostGuestFeedbackMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import { MutationCallbacks } from '../../../types';
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

  const { handleError } = useHandleError<FeedbackInput, null>();

  const submitFeedback = async (
    payload: FeedbackInput,
    callbacks?: MutationCallbacks
  ) => {
    setSuccess(false);

    try {
      /* istanbul ignore else */
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
        savingFinished:
          /* istanbul ignore next */
          () => undefined,
      });
    }
  };
  return { setSuccess, submitFeedback, success };
};

export default useFeedbackActions;
