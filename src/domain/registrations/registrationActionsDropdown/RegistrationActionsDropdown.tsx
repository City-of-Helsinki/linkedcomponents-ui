import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useRegistrationPublisher from '../../registration/hooks/useRegistrationPublisher';
import useRegistrationUpdateActions, {
  MODALS,
} from '../../registration/hooks/useRegistrationUpdateActions';
import ConfirmDeleteModal from '../../registration/modals/confirmDeleteModal/ConfirmDeleteModal';
import {
  copyEnrolmentLinkToClipboard,
  copyRegistrationToSessionStorage,
  getEditButtonProps,
  getRegistrationFields,
} from '../../registration/utils';
import useUser from '../../user/hooks/useUser';
import { REGISTRATION_ACTIONS } from '../constants';

export interface RegistrationActionsDropdownProps {
  className?: string;
  registration: RegistrationFieldsFragment;
}

const RegistrationActionsDropdown = React.forwardRef<
  HTMLDivElement,
  RegistrationActionsDropdownProps
>(({ className, registration }, ref) => {
  const { t } = useTranslation();
  const { isAuthenticated: authenticated } = useAuth();
  const locale = useLocale();
  const navigate = useNavigate();
  const { id, registrationUrl } = getRegistrationFields(registration, locale);
  const queryStringWithReturnPath = useQueryStringWithReturnPath();
  const { user } = useUser();

  const publisher = useRegistrationPublisher({ registration }) as string;
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { closeModal, deleteRegistration, openModal, saving, setOpenModal } =
    useRegistrationUpdateActions({
      registration,
    });

  const goToEditRegistrationPage = () => {
    const registrationUrlWithReturnPath = `${registrationUrl}${queryStringWithReturnPath}`;
    navigate(registrationUrlWithReturnPath);
  };

  const goToRegistrationEnrolmentsPage = () => {
    navigate({
      pathname: `/${locale}${ROUTES.REGISTRATION_ENROLMENTS.replace(
        ':registrationId',
        id
      )}`,
      search: queryStringWithReturnPath,
    });
  };

  const copyRegistration = async () => {
    await copyRegistrationToSessionStorage(registration);
    navigate(`/${locale}${ROUTES.CREATE_REGISTRATION}`);
  };

  const onDelete = () => {
    deleteRegistration();
  };

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: REGISTRATION_ACTIONS;
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
      action: REGISTRATION_ACTIONS.EDIT,
      onClick: goToEditRegistrationPage,
    }),
    getActionItemProps({
      action: REGISTRATION_ACTIONS.SHOW_ENROLMENTS,
      onClick: goToRegistrationEnrolmentsPage,
    }),
    getActionItemProps({
      action: REGISTRATION_ACTIONS.COPY,
      onClick: copyRegistration,
    }),
    getActionItemProps({
      action: REGISTRATION_ACTIONS.COPY_LINK,
      onClick: () => {
        copyEnrolmentLinkToClipboard({ locale, registration, t });
      },
    }),
    getActionItemProps({
      action: REGISTRATION_ACTIONS.DELETE,
      onClick: () => setOpenModal(MODALS.DELETE),
    }),
  ].filter(skipFalsyType);

  return (
    <div ref={ref}>
      {openModal === MODALS.DELETE && (
        <ConfirmDeleteModal
          isOpen={openModal === MODALS.DELETE}
          isSaving={saving === REGISTRATION_ACTIONS.DELETE}
          onClose={closeModal}
          onDelete={onDelete}
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </div>
  );
});

export default RegistrationActionsDropdown;
