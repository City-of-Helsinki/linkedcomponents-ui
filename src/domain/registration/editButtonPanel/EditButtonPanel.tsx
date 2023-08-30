import { ButtonVariant } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import styles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import { ActionButtonProps, ButtonType } from '../../../types';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import { RegistrationsLocationState } from '../../registrations/types';
import useUser from '../../user/hooks/useUser';
import {
  copyRegistrationToSessionStorage,
  copySignupLinkToClipboard,
  getEditButtonProps,
  getRegistrationFields,
} from '../utils';

export interface EditButtonPanelProps {
  onDelete: () => void;
  onUpdate: () => void;
  publisher: string;
  registration: RegistrationFieldsFragment;
  saving: REGISTRATION_ACTIONS | null;
}

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  onDelete,
  onUpdate,
  publisher,
  registration,
  saving,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated: authenticated } = useAuth();
  const locale = useLocale();
  const navigate = useNavigate();
  const { id } = getRegistrationFields(registration, locale);
  const queryStringWithReturnPath = useQueryStringWithReturnPath();
  const { user } = useUser();

  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const goBack = useGoBack<RegistrationsLocationState>({
    defaultReturnPath: ROUTES.REGISTRATIONS,
    state: { registrationId: getValue(registration.id, '') },
  });

  const copyRegistration = async () => {
    await copyRegistrationToSessionStorage(registration);
    navigate(`/${locale}${ROUTES.CREATE_REGISTRATION}`);
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

  const goToAttendanceListPage = () => {
    navigate({
      pathname: `/${locale}${ROUTES.ATTENDANCE_LIST.replace(
        ':registrationId',
        id
      )}`,
      search: queryStringWithReturnPath,
    });
  };

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: REGISTRATION_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps => {
    return getEditButtonProps({
      action,
      authenticated,
      onClick,
      organizationAncestors,
      registration,
      t,
      user,
    });
  };

  const getActionButtonProps = ({
    action,
    onClick,
    type,
    variant,
  }: {
    action: REGISTRATION_ACTIONS;
    onClick: () => void;
    type: ButtonType;
    variant: Exclude<ButtonVariant, 'supplementary'>;
  }): ActionButtonProps => {
    const buttonProps = getActionItemProps({
      action,
      onClick,
    });
    return { ...buttonProps, isSaving: saving === action, type, variant };
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      action: REGISTRATION_ACTIONS.SHOW_ENROLMENTS,
      onClick: goToRegistrationEnrolmentsPage,
    }),
    getActionItemProps({
      action: REGISTRATION_ACTIONS.EDIT_ATTENDANCE_LIST,
      onClick: goToAttendanceListPage,
    }),
    getActionItemProps({
      action: REGISTRATION_ACTIONS.COPY,
      onClick: copyRegistration,
    }),
    getActionItemProps({
      action: REGISTRATION_ACTIONS.COPY_LINK,
      onClick: () => {
        copySignupLinkToClipboard({ locale, registration, t });
      },
    }),
    getActionItemProps({
      action: REGISTRATION_ACTIONS.DELETE,
      onClick: onDelete,
    }),
  ];

  const actionButtons: ActionButtonProps[] = [
    /* Actions for draft event */
    getActionButtonProps({
      action: REGISTRATION_ACTIONS.UPDATE,
      onClick: () => onUpdate(),
      type: 'submit',
      variant: 'primary',
    }),
  ].filter(skipFalsyType);

  return (
    <ButtonPanel
      actionItems={actionItems}
      onBack={goBack}
      submitButtons={actionButtons.map(
        ({ icon, disabled, label, isSaving, type, variant, ...rest }) => (
          <LoadingButton
            key={label}
            {...rest}
            className={styles.fullWidthOnMobile}
            disabled={disabled || Boolean(saving)}
            icon={icon}
            loading={isSaving}
            type={type}
            variant={variant}
          >
            {label}
          </LoadingButton>
        )
      )}
    />
  );
};

export default EditButtonPanel;
