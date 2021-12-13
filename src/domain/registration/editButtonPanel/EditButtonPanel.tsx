import { ButtonVariant } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import Button from '../../../common/components/button/Button';
import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import styles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import { REGISTRATION_EDIT_ACTIONS } from '../../registrations/constants';
import useQueryStringWithReturnPath from '../../registrations/hooks/useRegistrationsQueryStringWithReturnPath';
import { RegistrationsLocationState } from '../../registrations/types';
import { getRegistrationFields } from '../../registrations/utils';
import { copyRegistrationToSessionStorage, getEditButtonProps } from '../utils';

type ButtonType = 'button' | 'reset' | 'submit' | undefined;

type ActionButtonProps = {
  isSaving: boolean;
  type: ButtonType;
  variant: Exclude<ButtonVariant, 'supplementary'>;
} & MenuItemOptionProps;

export interface EditButtonPanelProps {
  onDelete: () => void;
  onUpdate: () => void;
  registration: RegistrationFieldsFragment;
  saving: REGISTRATION_EDIT_ACTIONS | false;
}

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  onDelete,
  onUpdate,
  registration,
  saving,
}) => {
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const locale = useLocale();
  const history = useHistory<RegistrationsLocationState>();
  const { id } = getRegistrationFields(registration, locale);
  const queryStringWithReturnPath = useQueryStringWithReturnPath();

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
    action: REGISTRATION_EDIT_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps => {
    return getEditButtonProps({
      action,
      authenticated,
      onClick,
      registration,
      t,
    });
  };

  const getActionButtonProps = ({
    action,
    onClick,
    type = 'button',
    variant,
  }: {
    action: REGISTRATION_EDIT_ACTIONS;
    onClick: () => void;
    type: ButtonType;
    variant: Exclude<ButtonVariant, 'supplementary'>;
  }): ActionButtonProps => {
    const buttonProps = getEditButtonProps({
      action,
      authenticated,
      onClick,
      registration,
      t,
    });
    return { ...buttonProps, isSaving: saving === action, type, variant };
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      action: REGISTRATION_EDIT_ACTIONS.SHOW_ENROLMENTS,
      onClick: goToRegistrationEnrolmentsPage,
    }),
    getActionItemProps({
      action: REGISTRATION_EDIT_ACTIONS.COPY,
      onClick: copyRegistration,
    }),
    getActionItemProps({
      action: REGISTRATION_EDIT_ACTIONS.DELETE,
      onClick: onDelete,
    }),
  ];

  const actionButtons: ActionButtonProps[] = [
    /* Actions for draft event */
    getActionButtonProps({
      action: REGISTRATION_EDIT_ACTIONS.UPDATE,
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
          <Button
            key={index}
            {...rest}
            className={styles.fullWidthOnMobile}
            disabled={disabled || Boolean(saving)}
            iconLeft={
              isSaving ? (
                <LoadingSpinner
                  className={styles.loadingSpinner}
                  isLoading={isSaving}
                  small={true}
                />
              ) : (
                icon
              )
            }
            type={type}
            variant={variant as Exclude<ButtonVariant, 'supplementary'>}
          >
            {label}
          </Button>
        )
      )}
    />
  );
};

export default EditButtonPanel;
