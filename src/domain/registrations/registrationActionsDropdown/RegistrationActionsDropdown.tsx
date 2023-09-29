/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { REGISTRATION_MODALS } from '../../registration/constants';
import useRegistrationActions from '../../registration/hooks/useRegistrationActions';
import ConfirmDeleteRegistrationModal from '../../registration/modals/confirmDeleteRegistrationModal/ConfirmDeleteRegistrationModal';
import {
  copyRegistrationToSessionStorage,
  copySignupLinkToClipboard,
  getRegistrationActionButtonProps,
  getRegistrationFields,
} from '../../registration/utils';
import useUser from '../../user/hooks/useUser';
import { REGISTRATION_ACTIONS } from '../constants';

export interface RegistrationActionsDropdownProps {
  className?: string;
  registration: RegistrationFieldsFragment;
}

const RegistrationActionsDropdown: React.FC<
  RegistrationActionsDropdownProps
> = ({ className, registration }) => {
  const { t } = useTranslation();
  const { isAuthenticated: authenticated } = useAuth();
  const locale = useLocale();
  const navigate = useNavigate();
  const { id, registrationUrl } = getRegistrationFields(registration, locale);
  const publisher = getValue(registration.publisher, '');
  const queryStringWithReturnPath = useQueryStringWithReturnPath();
  const { user } = useUser();
  const { addNotification } = useNotificationsContext();

  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { closeModal, deleteRegistration, openModal, saving, setOpenModal } =
    useRegistrationActions({ registration });

  const goToEditRegistrationPage = () => {
    const registrationUrlWithReturnPath = `${registrationUrl}${queryStringWithReturnPath}`;
    navigate(registrationUrlWithReturnPath);
  };

  const goToRegistrationSignupsPage = () => {
    navigate({
      pathname: `/${locale}${ROUTES.REGISTRATION_SIGNUPS.replace(
        ':registrationId',
        id
      )}`,
      search: queryStringWithReturnPath,
    });
  };
  const goToAttendenceListPage = () => {
    navigate({
      pathname: `/${locale}${ROUTES.ATTENDANCE_LIST.replace(
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

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: REGISTRATION_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getRegistrationActionButtonProps({
      action,
      authenticated,
      onClick,
      organizationAncestors,
      registration,
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
      action: REGISTRATION_ACTIONS.SHOW_SIGNUPS,
      onClick: goToRegistrationSignupsPage,
    }),
    getActionItemProps({
      action: REGISTRATION_ACTIONS.EDIT_ATTENDANCE_LIST,
      onClick: goToAttendenceListPage,
    }),
    getActionItemProps({
      action: REGISTRATION_ACTIONS.COPY,
      onClick: copyRegistration,
    }),
    getActionItemProps({
      action: REGISTRATION_ACTIONS.COPY_LINK,
      onClick: () => {
        copySignupLinkToClipboard({ addNotification, locale, registration, t });
      },
    }),
    getActionItemProps({
      action: REGISTRATION_ACTIONS.DELETE,
      onClick: () => setOpenModal(REGISTRATION_MODALS.DELETE),
    }),
  ].filter(skipFalsyType);

  return (
    <>
      {openModal === REGISTRATION_MODALS.DELETE && (
        <ConfirmDeleteRegistrationModal
          isOpen={openModal === REGISTRATION_MODALS.DELETE}
          isSaving={saving === REGISTRATION_ACTIONS.DELETE}
          onClose={closeModal}
          onConfirm={() =>
            deleteRegistration({
              onSuccess: () => {
                addNotification({
                  label: t('registration.form.notificationRegistrationDeleted'),
                  type: 'success',
                });
              },
            })
          }
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </>
  );
};

export default RegistrationActionsDropdown;
