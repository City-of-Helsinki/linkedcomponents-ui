import { useLocation } from 'react-router';

import { useSendRegistrationUserInvitationMutation } from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import { reportError } from '../../app/sentry/utils';
import useUser from '../../user/hooks/useUser';
import { REGISTRATION_USER_ACTIONS } from '../constants';

interface UseRegistrationUserActionsProps {
  id: number | null;
}

type UseRegistrationUserActionsState = {
  saving: REGISTRATION_USER_ACTIONS | null;
  sendInvitation: (callbacks?: MutationCallbacks) => Promise<void>;
};
const useRegistrationUserActions = ({
  id,
}: UseRegistrationUserActionsProps): UseRegistrationUserActionsState => {
  const { user } = useUser();
  const location = useLocation();
  const [saving, setSaving] = useMountedState<REGISTRATION_USER_ACTIONS | null>(
    null
  );

  const [sendInvitationMutation] = useSendRegistrationUserInvitationMutation();

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (
    callbacks?: MutationCallbacks,
    id?: string
  ) => {
    savingFinished();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess(id));
  };

  const handleError = ({
    callbacks,
    error,
    message,
  }: {
    callbacks?: MutationCallbacks;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: string;
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: { error, id },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const sendInvitation = async (callbacks?: MutationCallbacks) => {
    try {
      setSaving(REGISTRATION_USER_ACTIONS.SEND_INVITATION);
      await sendInvitationMutation({ variables: { id: id as number } });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to send invitation to registration user',
      });
    }
  };

  return {
    saving,
    sendInvitation,
  };
};

export default useRegistrationUserActions;
