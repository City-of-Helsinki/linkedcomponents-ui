import classNames from 'classnames';
import { NotificationType } from 'hds-react';
import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Notification from '../../../common/components/notification/Notification';
import { Editability } from '../../../types';
import getValue from '../../../utils/getValue';
import { useAuth } from '../../auth/hooks/useAuth';
import useUser from '../../user/hooks/useUser';
import styles from './authenticationNotification.module.scss';

export const hiddenStyles = {
  border: 'none',
  height: 0,
  margin: 0,
  padding: 0,
};

export type AdminType = 'admin' | 'any' | 'external' | 'registrationAdmin';

type CommonProps = {
  className?: string;
  requiredOrganizationType?: AdminType[];
};

type OnlyNotAuthenticatedErrorProps = {
  authorizationWarningLabel?: null;
  getAuthorizationWarning?: null;
  noRequiredOrganizationLabel?: null;
  noRequiredOrganizationText?: null;
  showOnlyNotAuthenticatedError: true;
  notAuthenticatedCustomMessage?: ReactNode;
} & CommonProps;

type AllErrorsProps = {
  authorizationWarningLabel: string;
  getAuthorizationWarning: () => Editability;
  noRequiredOrganizationLabel: string;
  noRequiredOrganizationText: string;
  showOnlyNotAuthenticatedError?: false;
  notAuthenticatedCustomMessage?: ReactNode;
} & CommonProps;

export type AuthenticationNotificationProps =
  | OnlyNotAuthenticatedErrorProps
  | AllErrorsProps;

const AuthenticationNotification: React.FC<AuthenticationNotificationProps> = ({
  authorizationWarningLabel,
  className,
  getAuthorizationWarning,
  noRequiredOrganizationLabel,
  noRequiredOrganizationText,
  requiredOrganizationType = ['admin'],
  showOnlyNotAuthenticatedError,
  notAuthenticatedCustomMessage,
}) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);
  const { signIn } = useAuth();

  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const adminOrganizations = getValue(user?.adminOrganizations, []);
  const registrationAdminOrganizations = getValue(
    user?.registrationAdminOrganizations,
    []
  );
  const organizationMemberships = getValue(user?.organizationMemberships, []);
  const userOrganizations = [
    ...adminOrganizations,
    ...registrationAdminOrganizations,
    ...organizationMemberships,
  ];

  const getAuthenticationWarnings = () => {
    /* istanbul ignore else */
    if (authenticated) {
      const hasRequiredOrganization = () => {
        if (requiredOrganizationType.includes('external')) {
          return true;
        }

        if (
          requiredOrganizationType.includes('admin') &&
          adminOrganizations.length
        ) {
          return true;
        }

        if (
          requiredOrganizationType.includes('registrationAdmin') &&
          registrationAdminOrganizations.length
        ) {
          return true;
        }

        return (
          requiredOrganizationType.includes('any') && userOrganizations.length
        );
      };

      if (!hasRequiredOrganization()) {
        return {
          children: <p>{noRequiredOrganizationText}</p>,
          label: noRequiredOrganizationLabel,
        };
      }

      /* istanbul ignore else */
      if (typeof getAuthorizationWarning === 'function') {
        const { warning } = getAuthorizationWarning();

        if (warning) {
          return {
            children: <p>{warning}</p>,
            label: authorizationWarningLabel,
          };
        }
      }
    }

    return { label: null };
  };

  const notificationProps = {
    className: classNames(styles.authenticationNotification, className),
    closeAnimationDuration: 300,
    closeButtonLabelText: getValue(t('common.close'), ''),
    dismissible: true,
    onClose: () => setHidden(true),
    style: hidden ? hiddenStyles : undefined,
    type: 'info' as NotificationType,
  };

  const handleSignIn = () => {
    signIn(`${location.pathname}${location.search}`);
  };

  if (!authenticated) {
    const message = notAuthenticatedCustomMessage ? (
      notAuthenticatedCustomMessage
    ) : (
      <p>
        {t('authenticationNotification.part1')}{' '}
        <button className={styles.button} onClick={handleSignIn} type="button">
          {t('authenticationNotification.button')}
        </button>
        {t('authenticationNotification.part2')}
      </p>
    );

    return (
      <Notification {...notificationProps} label={t('common.signIn')}>
        {message}
      </Notification>
    );
  }

  const { label, children } = getAuthenticationWarnings();

  if (showOnlyNotAuthenticatedError || !label) {
    return null;
  }

  return (
    <Notification {...notificationProps} label={label}>
      {children}
    </Notification>
  );
};

export default AuthenticationNotification;
