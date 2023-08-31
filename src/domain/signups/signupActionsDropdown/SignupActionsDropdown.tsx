/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import {
  RegistrationFieldsFragment,
  SignupFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useAuth } from '../../auth/hooks/useAuth';
import { SIGNUP_ACTIONS, SIGNUP_MODALS } from '../../enrolment/constants';
import { useEnrolmentPageContext } from '../../enrolment/enrolmentPageContext/hooks/useEnrolmentPageContext';
import useEnrolmentActions from '../../enrolment/hooks/useEnrolmentActions';
import ConfirmCancelSignupModal from '../../enrolment/modals/confirmCancelSignupModal/ConfirmCancelSignupModal';
import SendMessageModal from '../../enrolment/modals/sendMessageModal/SendMessageModal';
import { getEditButtonProps } from '../../enrolment/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { getRegistrationFields } from '../../registration/utils';
import { addParamsToRegistrationQueryString } from '../../registrations/utils';
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
  const locale = useLocale();
  const navigate = useNavigate();
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { pathname, search } = useLocation();
  const { id: registrationId } = getRegistrationFields(registration, locale);
  const { signupGroup } = getSignupFields({
    language: locale,
    registration,
    signup,
  });

  const { closeModal, openModal, openModalId, setOpenModalId, setOpenModal } =
    useEnrolmentPageContext();

  const { cancelEnrolment, saving, sendMessage } = useEnrolmentActions({
    enrolment: signup,
    registration,
  });

  const goToEditPage = () => {
    const queryString = addParamsToRegistrationQueryString(search, {
      returnPath: pathname,
    });

    if (signupGroup) {
      navigate({
        pathname: `/${locale}${ROUTES.EDIT_SIGNUP_GROUP.replace(
          ':registrationId',
          registrationId
        ).replace(':signupGroupId', signupGroup)}`,
        search: queryString,
      });
    } else {
      toast.error('TODO: Editing a single signup is not supported yet');
    }
  };

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: SIGNUP_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getEditButtonProps({
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
      action: SIGNUP_ACTIONS.CANCEL,
      onClick: () => {
        setOpenModalId(signup.id);
        setOpenModal(SIGNUP_MODALS.CANCEL);
      },
    }),
  ].filter(skipFalsyType);

  const isModalOpen = (modal: SIGNUP_MODALS) =>
    openModalId === signup.id && openModal === modal;

  return (
    <>
      {isModalOpen(SIGNUP_MODALS.CANCEL) && (
        <ConfirmCancelSignupModal
          isOpen={openModal === SIGNUP_MODALS.CANCEL}
          isSaving={saving === SIGNUP_ACTIONS.CANCEL}
          onConfirm={cancelEnrolment}
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
