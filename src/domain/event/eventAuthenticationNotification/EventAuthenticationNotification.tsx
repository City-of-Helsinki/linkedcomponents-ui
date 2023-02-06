import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../generated/graphql';
import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { EVENT_ACTIONS } from '../constants';
import { checkIsActionAllowed } from '../utils';

export type EventAuthenticationNotificationProps = {
  event?: EventFieldsFragment;
};

const EventAuthenticationNotification: React.FC<
  EventAuthenticationNotificationProps
> = ({ event }) => {
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();

  const userOrganizations = user
    ? [...user?.adminOrganizations, ...user.organizationMemberships]
    : [];
  const { t } = useTranslation();
  const { organizationAncestors } = useOrganizationAncestors(
    event?.publisher as string
  );

  const getNotificationProps = () => {
    /* istanbul ignore else */
    if (authenticated) {
      if (!userOrganizations.length) {
        return {
          children: <p>{t('authentication.noRightsUpdateEvent')}</p>,
          label: t('authentication.noRightsUpdateEventLabel'),
        };
      }

      if (event) {
        const action =
          event.publicationStatus === PublicationStatus.Draft
            ? EVENT_ACTIONS.UPDATE_DRAFT
            : EVENT_ACTIONS.UPDATE_PUBLIC;
        const { warning } = checkIsActionAllowed({
          action,
          authenticated,
          event,
          organizationAncestors,
          t,
          user,
        });

        if (warning) {
          return {
            children: <p>{warning}</p>,
            label: t('event.form.notificationTitleCannotEdit'),
          };
        }
      }
    }

    return { label: null };
  };

  return <AuthenticationNotification {...getNotificationProps()} />;
};

export default EventAuthenticationNotification;
