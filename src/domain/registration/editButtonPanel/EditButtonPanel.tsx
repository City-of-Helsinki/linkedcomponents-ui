import { ButtonVariant } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import styles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import useQueryStringWithReturnPath from '../../registrations/hooks/useRegistrationsQueryStringWithReturnPath';
import { RegistrationsLocationState } from '../../registrations/types';
import useUser from '../../user/hooks/useUser';
import {
  copyEnrolmentLinkToClipboard,
  copyRegistrationToSessionStorage,
  getEditButtonProps,
  getRegistrationFields,
} from '../utils';

type ButtonType = 'button' | 'reset' | 'submit' | undefined;

type ActionButtonProps = {
  isSaving: boolean;
  type: ButtonType;
  variant: Exclude<ButtonVariant, 'supplementary'>;
} & MenuItemOptionProps;

export interface EditButtonPanelProps {
  onDelete: () => void;
  onUpdate: () => void;
  publisher: string;
  registration: RegistrationFieldsFragment;
  saving: REGISTRATION_ACTIONS | false;
}

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  onDelete,
  onUpdate,
  publisher,
  registration,
  saving,
}) => {
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const locale = useLocale();
  const history = useHistory<RegistrationsLocationState>();
  const { id } = getRegistrationFields(registration, locale);
  const queryStringWithReturnPath = useQueryStringWithReturnPath();
  const { user } = useUser();

  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const goBack = useGoBack<RegistrationsLocationState>({
    defaultReturnPath: ROUTES.REGISTRATIONS,
    state: { registrationId: registration.id as string },
  });

  const copyRegistration = async () => {
    await copyRegistrationToSessionStorage(registration);
    history.push(`/${locale}${ROUTES.CREATE_REGISTRATION}`);
  };

  const goToRegistrationEnrolmentsPage = () => {
    history.push({
      pathname: `/${locale}${ROUTES.REGISTRATION_ENROLMENTS.replace(
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
      publisher,
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
        (
          { icon, disabled, label, isSaving, type, variant, ...rest },
          index
        ) => (
          <LoadingButton
            key={index}
            {...rest}
            className={styles.fullWidthOnMobile}
            disabled={disabled || Boolean(saving)}
            icon={icon}
            loading={isSaving}
            type={type}
            variant={variant as Exclude<ButtonVariant, 'supplementary'>}
          >
            {label}
          </LoadingButton>
        )
      )}
    />
  );
};

export default EditButtonPanel;
