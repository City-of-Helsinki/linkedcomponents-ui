import React from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import AuthenticationNotification, {
  AdminType,
} from '../../app/authenticationNotification/AuthenticationNotification';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { EVENT_ACTIONS } from '../constants';
import { checkIsActionAllowed } from '../utils';

export type EventAuthenticationNotificationProps = {
  event?: EventFieldsFragment | null;
};

const EventAuthenticationNotification: React.FC<
  EventAuthenticationNotificationProps
> = ({ event }) => {
  const { isAuthenticated: authenticated } = useAuth();
  const { user, loading } = useUser();

  const { t } = useTranslation();
  const { organizationAncestors } = useOrganizationAncestors(
    getValue(event?.publisher, '')
  );

  const ENABLE_EXTERNAL_USER_EVENTS =
    import.meta.env.REACT_APP_ENABLE_EXTERNAL_USER_EVENTS === 'true';
  const requiredOrganizationType: AdminType[] = ENABLE_EXTERNAL_USER_EVENTS
    ? ['external']
    : ['any'];

  return (
    <LoadingSpinner isLoading={loading}>
      <AuthenticationNotification
        authorizationWarningLabel={t('event.form.notificationTitleCannotEdit')}
        getAuthorizationWarning={() => {
          if (event) {
            const action =
              event.publicationStatus === PublicationStatus.Draft
                ? EVENT_ACTIONS.UPDATE_DRAFT
                : EVENT_ACTIONS.UPDATE_PUBLIC;

            return checkIsActionAllowed({
              action,
              authenticated,
              event,
              organizationAncestors,
              t,
              user,
            });
          }
          return { warning: '', editable: true };
        }}
        noRequiredOrganizationLabel={t(
          'authentication.noRightsUpdateEventLabel'
        )}
        noRequiredOrganizationText={t('authentication.noRightsUpdateEvent')}
        requiredOrganizationType={requiredOrganizationType}
        notAuthenticatedCustomMessage={
          <>
            <p
              dangerouslySetInnerHTML={{
                __html: t('event.form.notificationNotAuthenticated.paragraph1'),
              }}
            />
            <p>{t('event.form.notificationNotAuthenticated.paragraph2')}</p>
          </>
        }
      />
    </LoadingSpinner>
  );
};

export default EventAuthenticationNotification;
