import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import React from 'react';
import { useLocation } from 'react-router';

import {
  RegistrationFieldsFragment,
  UpdateEventMutationInput,
  UpdateRegistrationMutationInput,
  useUpdateRegistrationMutation,
} from '../../../generated/graphql';
import useIsMounted from '../../../hooks/useIsMounted';
import isTestEnv from '../../../utils/isTestEnv';
import { reportError } from '../../app/sentry/utils';
import { REGISTRATION_EDIT_ACTIONS } from '../../registrations/constants';
import { clearRegistrationsQueries } from '../../registrations/utils';
import useUser from '../../user/hooks/useUser';
import { RegistrationFormFields } from '../types';
import { getRegistrationPayload } from '../utils';

interface Callbacks {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
  onSuccess?: () => void;
}

interface Props {
  registration: RegistrationFieldsFragment;
}

type UseEventUpdateActionsState = {
  saving: REGISTRATION_EDIT_ACTIONS | false;
  updateRegistration: (
    values: RegistrationFormFields,
    callbacks?: Callbacks
  ) => Promise<void>;
};
const useRegistrationUpdateActions = ({
  registration,
}: Props): UseEventUpdateActionsState => {
  const isMounted = useIsMounted();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { user } = useUser();
  const location = useLocation();
  const [saving, setSaving] = React.useState<REGISTRATION_EDIT_ACTIONS | false>(
    false
  );
  const [updateRegistrationMutation] = useUpdateRegistrationMutation();

  const savingFinished = () => {
    /* istanbul ignore else */
    if (isMounted.current) {
      setSaving(false);
    }
  };

  const cleanAfterUpdate = async (callbacks?: Callbacks) => {
    /* istanbul ignore next */
    !isTestEnv && clearRegistrationsQueries(apolloClient);

    savingFinished();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess());
  };

  const handleError = ({
    callbacks,
    error,
    message,
    payload,
  }: {
    callbacks?: Callbacks;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: string;
    payload?: UpdateEventMutationInput[];
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        payloadAsString: payload && JSON.stringify(payload),
        registration,
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const updateRegistration = async (
    values: RegistrationFormFields,
    callbacks?: Callbacks
  ) => {
    const payload: UpdateEventMutationInput[] = [];

    try {
      setSaving(REGISTRATION_EDIT_ACTIONS.UPDATE);

      const payload: UpdateRegistrationMutationInput = {
        ...getRegistrationPayload(values),
        id: registration.id as string,
      };
      await updateRegistrationMutation({ variables: { input: payload } });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update registration',
        payload,
      });
    }
  };

  return {
    saving,
    updateRegistration,
  };
};

export default useRegistrationUpdateActions;
