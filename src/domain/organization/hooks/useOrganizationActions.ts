import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import omit from 'lodash/omit';

import {
  OrganizationFieldsFragment,
  UpdateOrganizationMutationInput,
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  usePatchOrganizationMutation,
  useUpdateOrganizationMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearOrganizationQueries,
  clearOrganizationsQueries,
} from '../../app/apollo/clearCacheUtils';
import useUser from '../../user/hooks/useUser';
import {
  ORGANIZATION_ACTIONS,
  ORGANIZATION_FINANCIAL_INFO_ACTIONS,
} from '../constants';
import { OrganizationFormFields } from '../types';
import {
  checkCanUserDoFinancialInfoAction,
  checkCanUserDoOrganizationAction,
  getOrganizationPayload,
  omitSensitiveDataFromOrganizationPayload,
} from '../utils';

export enum ORGANIZATION_MODALS {
  DELETE = 'delete',
}

interface Props {
  organization?: OrganizationFieldsFragment;
}

type UseKeywordUpdateActionsState = {
  closeModal: () => void;
  createOrganization: (
    values: OrganizationFormFields,
    callbacks?: MutationCallbacks<string>
  ) => Promise<void>;
  deleteOrganization: (callbacks?: MutationCallbacks<string>) => Promise<void>;
  openModal: ORGANIZATION_MODALS | null;
  saving: ORGANIZATION_ACTIONS | null;
  setOpenModal: (modal: ORGANIZATION_MODALS | null) => void;
  setSaving: (action: ORGANIZATION_ACTIONS | null) => void;
  updateOrganization: (
    values: OrganizationFormFields,
    callbacks?: MutationCallbacks<string>
  ) => Promise<void>;
};

const useOrganizationUpdateActions = ({
  organization,
}: Props): UseKeywordUpdateActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { user } = useUser();
  const [openModal, setOpenModal] = useMountedState<ORGANIZATION_MODALS | null>(
    null
  );
  const [saving, setSaving] = useMountedState<ORGANIZATION_ACTIONS | null>(
    null
  );

  const [createOrganizationMutation] = useCreateOrganizationMutation();
  const [deleteOrganizationMutation] = useDeleteOrganizationMutation();
  const [patchOrganizationMutation] = usePatchOrganizationMutation();
  const [updateOrganizationMutation] = useUpdateOrganizationMutation();

  const closeModal = () => {
    setOpenModal(null);
  };

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (
    id: string,
    callbacks?: MutationCallbacks<string>
  ) => {
    /* istanbul ignore next */
    !isTestEnv && clearOrganizationQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearOrganizationsQueries(apolloClient);

    savingFinished();
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess(id));
  };

  const { handleError } = useHandleError<
    UpdateOrganizationMutationInput,
    null
  >();

  const createOrganization = async (
    values: OrganizationFormFields,
    callbacks?: MutationCallbacks<string>
  ) => {
    setSaving(ORGANIZATION_ACTIONS.CREATE);
    const payload = getOrganizationPayload(values, user);

    try {
      const { data } = await createOrganizationMutation({
        variables: { input: payload },
      });

      await cleanAfterUpdate(data?.createOrganization.id as string, callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to create organization',
        payload: omitSensitiveDataFromOrganizationPayload(payload),
        savingFinished,
      });
    }
  };

  const deleteOrganization = async (callbacks?: MutationCallbacks<string>) => {
    try {
      const id = getValue(organization?.id, '');
      setSaving(ORGANIZATION_ACTIONS.DELETE);

      await deleteOrganizationMutation({
        variables: { id: getValue(organization?.id, '') },
      });

      await cleanAfterUpdate(id, callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete organization',
        savingFinished,
      });
    }
  };

  const patchOrganization = async (
    values: OrganizationFormFields,
    callbacks?: MutationCallbacks<string>
  ) => {
    const payload: UpdateOrganizationMutationInput = omit(
      getOrganizationPayload(values, user),
      'id'
    );

    try {
      setSaving(ORGANIZATION_ACTIONS.UPDATE);

      await patchOrganizationMutation({
        variables: { id: values.id, input: payload },
      });

      await cleanAfterUpdate(values.id, callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to patch organization',
        payload: omitSensitiveDataFromOrganizationPayload(payload),
        savingFinished,
      });
    }
  };
  const shouldPatchOrganization = (id: string) =>
    !checkCanUserDoOrganizationAction({
      action: ORGANIZATION_ACTIONS.UPDATE,
      id: id,
      user,
    }) &&
    checkCanUserDoFinancialInfoAction({
      action: ORGANIZATION_FINANCIAL_INFO_ACTIONS.MANAGE_IN_UPDATE,
      organizationId: id,
      user,
    });

  const updateOrganization = async (
    values: OrganizationFormFields,
    callbacks?: MutationCallbacks<string>
  ) => {
    if (shouldPatchOrganization(values.id)) {
      patchOrganization(values, callbacks);
    } else {
      const payload: UpdateOrganizationMutationInput = omit(
        getOrganizationPayload(values, user),
        'id'
      );

      try {
        setSaving(ORGANIZATION_ACTIONS.UPDATE);

        await updateOrganizationMutation({
          variables: { id: values.id, input: payload },
        });

        await cleanAfterUpdate(values.id, callbacks);
      } catch (error) /* istanbul ignore next */ {
        handleError({
          callbacks,
          error,
          message: 'Failed to update organization',
          payload: omitSensitiveDataFromOrganizationPayload(payload),
          savingFinished,
        });
      }
    }
  };

  return {
    closeModal,
    createOrganization,
    deleteOrganization,
    openModal,
    saving,
    setOpenModal,
    setSaving,
    updateOrganization,
  };
};

export default useOrganizationUpdateActions;
