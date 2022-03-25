import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import AuthenticationNotification from '../../app/authenticationNotification/AuthenticationNotification';
import { authenticatedSelector } from '../../auth/selectors';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { KEYWORD_ACTIONS } from '../constants';
import { checkIsEditActionAllowed } from '../utils';

export type KeywordAuthenticationNotificationProps = {
  action: KEYWORD_ACTIONS;
  publisher: string;
};

const KeywordAuthenticationNotification: React.FC<
  KeywordAuthenticationNotificationProps
> = ({ action, publisher }) => {
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const adminOrganizations = user?.adminOrganizations || [];
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { t } = useTranslation();

  const getNotificationProps = () => {
    if (authenticated) {
      if (!adminOrganizations.length) {
        return {
          children: <p>{t('authentication.noRightsUpdateKeyword')}</p>,
          label: t('authentication.noRightsUpdateKeywordLabel'),
        };
      }

      const { warning } = checkIsEditActionAllowed({
        action,
        authenticated,
        organizationAncestors,
        publisher,
        t,
        user,
      });

      if (warning) {
        return {
          children: <p>{warning}</p>,
          label: t('keyword.form.notificationTitleCannotEdit'),
        };
      }
    }

    return { label: null };
  };

  return <AuthenticationNotification {...getNotificationProps()} />;
};

export default KeywordAuthenticationNotification;
