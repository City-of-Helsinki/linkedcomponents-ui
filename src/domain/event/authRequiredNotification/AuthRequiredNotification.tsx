import { NotificationType } from 'hds-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import Notification from '../../../common/components/notification/Notification';
import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../generated/graphql';
import { signIn } from '../../auth/authenticate';
import { authenticatedSelector } from '../../auth/selectors';
import useUser from '../../user/hooks/useUser';
import { EVENT_EDIT_ACTIONS } from '../constants';
import useEventOrganizationAncestors from '../hooks/useEventOrganizationAncestors';
import { checkIsEditActionAllowed } from '../utils';
import styles from './authRequiredNotification.module.scss';

export const hiddenStyles = {
  border: 'none',
  height: 0,
  margin: 0,
  padding: 0,
};

export type AuthRequiredNotificationProps = {
  event?: EventFieldsFragment;
};

const AuthRequiredNotification: React.FC<AuthRequiredNotificationProps> = ({
  event,
}) => {
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();

  const userOrganizations = user
    ? [...user?.adminOrganizations, ...user.organizationMemberships]
    : [];
  const { t } = useTranslation();
  const { organizationAncestors } = useEventOrganizationAncestors(event);

  const handleSignIn = () => {
    signIn(`${location.pathname}${location.search}`);
  };

  const notificationProps = {
    className: styles.authRequiredNotification,
    closeAnimationDuration: 300,
    closeButtonLabelText: t('common.close') as string,
    dismissible: true,
    onClose: () => setHidden(true),
    style: hidden ? hiddenStyles : undefined,
    type: 'info' as NotificationType,
  };

  if (authenticated) {
    if (!userOrganizations.length) {
      return (
        <Notification
          {...notificationProps}
          label={t('authentication.noRightsUpdateEventLabel')}
        >
          <p>{t('authentication.noRightsUpdateEvent')}</p>
        </Notification>
      );
    }

    if (event) {
      const action =
        event.publicationStatus === PublicationStatus.Draft
          ? EVENT_EDIT_ACTIONS.UPDATE_DRAFT
          : EVENT_EDIT_ACTIONS.UPDATE_PUBLIC;
      const { warning } = checkIsEditActionAllowed({
        action,
        authenticated,
        event,
        organizationAncestors,
        t,
        user,
      });

      if (warning) {
        return (
          <Notification
            {...notificationProps}
            label={t('event.form.notificationTitleCannotEdit')}
          >
            <p>{warning}</p>
          </Notification>
        );
      }
    }

    return null;
  }

  return (
    <Notification {...notificationProps} label={t('common.signIn')}>
      <p>
        {t('authRequiredNotification.part1')}{' '}
        <button className={styles.button} onClick={handleSignIn} type="button">
          {t('authRequiredNotification.button')}
        </button>
        {t('authRequiredNotification.part2')}
      </p>
    </Notification>
  );
};

export default AuthRequiredNotification;
