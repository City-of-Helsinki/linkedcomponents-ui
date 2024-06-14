import { IconHome } from 'hds-react';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation } from 'react-router';

import { ROUTES } from '../../../constants';
import { featureFlagUtils } from '../../../utils/featureFlags';
import LayoutWithSideNavigation from '../../app/layout/layoutWithSideNavigation/LayoutWithSideNavigation';
import useUser from '../../user/hooks/useUser';
import { areFinancialRoutesAllowed } from '../../user/permissions';

const AdminPageLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { user } = useUser();

  const getIsActive = (localePath: string) => {
    return !!matchPath({ path: localePath, end: false }, pathname);
  };

  const adminSubLevels = [
    { label: t('keywordsPage.title'), to: ROUTES.KEYWORDS },
    { label: t('keywordSetsPage.title'), to: ROUTES.KEYWORD_SETS },
    { label: t('imagesPage.title'), to: ROUTES.IMAGES },
    ...(areFinancialRoutesAllowed(user)
      ? [{ label: t('organizationsPage.title'), to: ROUTES.ORGANIZATIONS }]
      : []),
    ...(featureFlagUtils.isFeatureEnabled('SHOW_PLACE_PAGES')
      ? [{ label: t('placesPage.title'), to: ROUTES.PLACES }]
      : /* istanbul ignore next */
        []),
    ...(areFinancialRoutesAllowed(user)
      ? [{ label: t('priceGroupsPage.title'), to: ROUTES.PRICE_GROUPS }]
      : []),
  ];

  const levels = [
    {
      icon: <IconHome />,
      label: t('adminPage.sideNavigation.labelAdmin'),
      subLevels: adminSubLevels,
      to: ROUTES.ADMIN,
    },
  ];

  return (
    <LayoutWithSideNavigation
      getIsActive={getIsActive}
      levels={levels}
      toggleButtonLabel={t('adminPage.sideNavigation.toggleButtonLabel')}
    >
      {children}
    </LayoutWithSideNavigation>
  );
};

export default AdminPageLayout;
