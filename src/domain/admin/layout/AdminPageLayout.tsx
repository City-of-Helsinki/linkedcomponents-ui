import { IconHome } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation } from 'react-router';

import { ROUTES } from '../../../constants';
import LayoutWithSideNavigation from '../../app/layout/layoutWithSideNavigation/LayoutWithSideNavigation';

interface Props {
  children: React.ReactNode;
}

const AdminPageLayout: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const getIsActive = (localePath: string) => {
    return !!matchPath({ path: localePath, end: false }, pathname);
  };

  const adminSubLevels = [
    {
      label: t('keywordsPage.title'),
      to: ROUTES.KEYWORDS,
    },
    {
      label: t('keywordSetsPage.title'),
      to: ROUTES.KEYWORD_SETS,
    },
    {
      label: t('organizationsPage.title'),
      to: ROUTES.ORGANIZATIONS,
    },
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
