import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import React from 'react';
import { useLocation } from 'react-router';

import {
  EnrolmentFieldsFragment,
  RegistrationFieldsFragment,
  UpdateEnrolmentMutationInput,
  useUpdateEnrolmentMutation,
} from '../../../generated/graphql';
import useIsMounted from '../../../hooks/useIsMounted';
import isTestEnv from '../../../utils/isTestEnv';
import { reportError } from '../../app/sentry/utils';
import { ENROLMENT_EDIT_ACTIONS } from '../../enrolments/constants';
import { clearRegistrationsQueries } from '../../registrations/utils';
import useUser from '../../user/hooks/useUser';
import { EnrolmentFormFields } from '../types';
import { getEnrolmentPayload } from '../utils';

interface Callbacks {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
  onSuccess?: () => void;
}

interface Props {
  enrolment: EnrolmentFieldsFragment;
  registration: RegistrationFieldsFragment;
}

type UseEnrolmentUpdateActionsState = {
  saving: ENROLMENT_EDIT_ACTIONS | false;
  updateEnrolment: (
    values: EnrolmentFormFields,
    callbacks?: Callbacks
  ) => Promise<void>;
};
const useEnrolmentUpdateActions = ({
  enrolment,
  registration,
}: Props): UseEnrolmentUpdateActionsState => {
  const isMounted = useIsMounted();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { user } = useUser();
  const location = useLocation();
  const [saving, setSaving] = React.useState<ENROLMENT_EDIT_ACTIONS | false>(
    false
  );

  const [updateEnrolmentMutation] = useUpdateEnrolmentMutation();

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
    payload?: UpdateEnrolmentMutationInput;
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        payloadAsString: payload && JSON.stringify(payload),
        enrolment,
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const updateEnrolment = async (
    values: EnrolmentFormFields,
    callbacks?: Callbacks
  ) => {
    let payload: UpdateEnrolmentMutationInput = {
      id: enrolment.id as string,
      registration: registration.id as string,
    };

    try {
      setSaving(ENROLMENT_EDIT_ACTIONS.UPDATE);

      payload = {
        ...getEnrolmentPayload(values, registration),
        id: enrolment.id as string,
      };

      await updateEnrolmentMutation({ variables: { input: payload } });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update enrolment',
        payload,
      });
    }
  };

  return {
    saving,
    updateEnrolment,
  };
};

export default useEnrolmentUpdateActions;
