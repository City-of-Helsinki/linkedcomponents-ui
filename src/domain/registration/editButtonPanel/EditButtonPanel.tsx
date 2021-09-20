import classNames from 'classnames';
import { ButtonVariant, IconArrowLeft, IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import Button from '../../../common/components/button/Button';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { Registration } from '../../../generated/graphql';
import useIsMobile from '../../../hooks/useIsMobile';
import useLocale from '../../../hooks/useLocale';
import Container from '../../app/layout/Container';
import { authenticatedSelector } from '../../auth/selectors';
import { REGISTRATION_EDIT_ACTIONS } from '../../registrations/constants';
import { RegistrationsLocationState } from '../../registrations/types';
import {
  addParamsToRegistrationQueryString,
  getRegistrationFields,
} from '../../registrations/utils';
import {
  copyRegistrationToSessionStorage,
  extractLatestReturnPath,
  getEditButtonProps,
} from '../utils';
import styles from './editButtonPanel.module.scss';

type ActionButtonProps = {
  isSaving: boolean;
  variant: Exclude<ButtonVariant, 'supplementary'>;
} & MenuItemOptionProps;

export interface EditButtonPanelProps {
  onDelete: () => void;
  onUpdate: () => void;
  registration: Registration;
  saving: boolean;
}

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  onDelete,
  onUpdate,
  registration,
  saving,
}) => {
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const { search } = useLocation();
  const locale = useLocale();
  const { pathname } = useLocation();
  const history = useHistory<RegistrationsLocationState>();
  const { id } = getRegistrationFields(registration, locale);
  const isMobile = useIsMobile();

  const goBack = () => {
    const { returnPath, remainingQueryString } =
      extractLatestReturnPath(search);

    history.push({
      pathname: `/${locale}${returnPath}`,
      search: remainingQueryString,
      state: { registrationId: registration.id as string },
    });
  };

  const copyRegistration = async () => {
    await copyRegistrationToSessionStorage(registration);
    history.push(`/${locale}${ROUTES.CREATE_REGISTRATION}`);
  };

  const goToRegistrationEnrolmentsPage = () => {
    const queryString = addParamsToRegistrationQueryString(search, {
      returnPath: pathname,
    });

    history.push({
      pathname: `/${locale}${ROUTES.REGISTRATION_ENROLMENTS.replace(
        ':registrationId',
        id
      )}`,
      search: queryString,
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
    variant,
  }: {
    action: REGISTRATION_EDIT_ACTIONS;
    onClick: () => void;
    variant: Exclude<ButtonVariant, 'supplementary'>;
  }): ActionButtonProps => {
    const buttonProps = getEditButtonProps({
      action,
      authenticated,
      onClick,
      registration,
      t,
    });
    return { ...buttonProps, isSaving: saving, variant };
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
      variant: 'primary',
    }),
  ].filter((i) => i) as ActionButtonProps[];

  return (
    <div className={styles.editButtonPanel}>
      <Container withOffset={true}>
        <div className={styles.buttonsRow}>
          <div className={styles.buttonWrapper}>
            <Button
              className={classNames(styles.backButton, styles.smallButton)}
              iconLeft={<IconArrowLeft />}
              fullWidth={true}
              onClick={goBack}
              type="button"
              variant="secondary"
            >
              {t('registration.form.buttonBack')}
            </Button>
            <div className={styles.actionsDropdown}>
              <MenuDropdown
                button={
                  isMobile ? (
                    <button className={styles.toggleButton}>
                      <IconMenuDots aria-hidden={true} />
                    </button>
                  ) : undefined
                }
                buttonLabel={t('registration.form.buttonActions')}
                closeOnItemClick={true}
                items={actionItems}
                menuPosition="top"
              />
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            {actionButtons.map(
              (
                { icon, disabled, label, isSaving, variant, ...rest },
                index
              ) => (
                <Button
                  key={index}
                  {...rest}
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
                  className={styles.mediumButton}
                  variant={variant as Exclude<ButtonVariant, 'supplementary'>}
                >
                  {label}
                </Button>
              )
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EditButtonPanel;
