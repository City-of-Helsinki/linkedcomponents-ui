/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import {
  RegistrationFieldsFragment,
  SignupFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { addParamsToRegistrationQueryString } from '../../registrations/utils';
import { SIGNUP_ACTIONS, SIGNUP_MODALS } from '../../signup/constants';
import useSignupActions from '../../signup/hooks/useSignupActions';
import ConfirmDeleteSignupOrSignupGroupModal from '../../signup/modals/confirmDeleteSignupOrSignupGroupModal/ConfirmDeleteSignupOrSignupGroupModal';
import SendMessageModal from '../../signup/modals/sendMessageModal/SendMessageModal';
import { getSignupActionButtonProps } from '../../signup/permissions';
import { useSignupGroupFormContext } from '../../signupGroup/signupGroupFormContext/hooks/useSignupGroupFormContext';
import useUser from '../../user/hooks/useUser';
import { getSignupFields } from '../utils';

export interface SignupActionsDropdownProps {
  className?: string;
  registration: RegistrationFieldsFragment;
  signup: SignupFieldsFragment;
}

const SignupActionsDropdown: React.FC<SignupActionsDropdownProps> = ({
  className,
  registration,
  signup,
}) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const navigate = useNavigate();
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { pathname, search } = useLocation();
  const { signupGroupUrl, signupUrl } = getSignupFields({
    language: locale,
    registration,
    signup,
  });

  const { closeModal, openModal, openModalId, setOpenModalId, setOpenModal } =
    useSignupGroupFormContext();

  const { deleteSignup, saving, sendMessage } = useSignupActions({
    registration,
    signup,
  });

  const goToEditPage = () => {
    const queryString = addParamsToRegistrationQueryString(search, {
      returnPath: pathname,
    });

    navigate({
      pathname: signupGroupUrl || signupUrl,
      search: queryString,
    });
  };

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: SIGNUP_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getSignupActionButtonProps({
      action,
      authenticated,
      onClick,
      organizationAncestors,
      publisher,
      t,
      user,
    });
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      action: SIGNUP_ACTIONS.EDIT,
      onClick: goToEditPage,
    }),
    getActionItemProps({
      action: SIGNUP_ACTIONS.SEND_MESSAGE,
      onClick: () => {
        setOpenModalId(signup.id);
        setOpenModal(SIGNUP_MODALS.SEND_MESSAGE_TO_SIGNUP);
      },
    }),
    getActionItemProps({
      action: SIGNUP_ACTIONS.DELETE,
      onClick: () => {
        setOpenModalId(signup.id);
        setOpenModal(SIGNUP_MODALS.DELETE);
      },
    }),
  ].filter(skipFalsyType);

  const isModalOpen = (modal: SIGNUP_MODALS) =>
    openModalId === signup.id && openModal === modal;

  return (
    <>
      {isModalOpen(SIGNUP_MODALS.DELETE) && (
        <ConfirmDeleteSignupOrSignupGroupModal
          isOpen={openModal === SIGNUP_MODALS.DELETE}
          isSaving={saving === SIGNUP_ACTIONS.DELETE}
          onConfirm={() =>
            deleteSignup({
              onSuccess: async () => {
                addNotification({
                  label: t('signup.form.notificationSignupDeleted'),
                  type: 'success',
                });
              },
            })
          }
          onClose={closeModal}
          registration={registration}
          signup={signup}
        />
      )}
      {isModalOpen(SIGNUP_MODALS.SEND_MESSAGE_TO_SIGNUP) && (
        <SendMessageModal
          isOpen={openModal === SIGNUP_MODALS.SEND_MESSAGE_TO_SIGNUP}
          isSaving={saving === SIGNUP_ACTIONS.SEND_MESSAGE}
          onClose={closeModal}
          onSendMessage={sendMessage}
          signup={signup}
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </>
  );
};

export default SignupActionsDropdown;
