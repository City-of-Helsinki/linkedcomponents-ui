import { IconCogwheel, IconHome, IconQuestionCircle } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../../constants';
import LayoutWithSideNavigation from '../../app/layout/layoutWithSideNavigation/LayoutWithSideNavigation';
import styles from './helpPageLayout.module.scss';

interface Props {
  children: React.ReactNode;
}

const HelpPageLayout: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation();

  const instructionsSubLevels = [
    {
      label: t('helpPage.sideNavigation.labelEventsInstructions'),
      to: ROUTES.INSTRUCTIONS_EVENTS,
    },
    {
      label: t('helpPage.sideNavigation.labelRegistrationInstructions'),
      to: ROUTES.INSTRUCTIONS_REGISTRATION,
    },
    {
      label: t('helpPage.sideNavigation.labelFaq'),
      to: ROUTES.INSTRUCTIONS_FAQ,
    },
  ];

  const technologySubLevels = [
    {
      label: t('helpPage.sideNavigation.labelSourceCode'),
      to: ROUTES.TECHNOLOGY_SOURCE_CODE,
    },
    {
      label: t('helpPage.sideNavigation.labelDocumentation'),
      to: ROUTES.TECHNOLOGY_DOCUMENTATION,
    },
  ];

  const supportSubLevels = [
    {
      label: t('helpPage.sideNavigation.labelServiceInformation'),
      to: ROUTES.SUPPORT_SERVICE_INFORMATION,
    },
    {
      label: t('helpPage.sideNavigation.labelTermsOfUse'),
      to: ROUTES.SUPPORT_TERMS_OF_USE,
    },
    {
      label: t('helpPage.sideNavigation.labelContact'),
      to: ROUTES.SUPPORT_CONTACT,
    },
    {
      label: t('helpPage.sideNavigation.labelAskPermission'),
      to: ROUTES.SUPPORT_ASK_PERMISSION,
    },
  ];

  const levels = [
    {
      icon: <IconQuestionCircle aria-hidden={true} />,
      label: t('helpPage.sideNavigation.labelSupport'),
      subLevels: supportSubLevels,
      to: ROUTES.SUPPORT,
    },
    {
      icon: <IconHome aria-hidden={true} />,
      label: t('helpPage.sideNavigation.labelInstructions'),
      subLevels: instructionsSubLevels,
      to: ROUTES.INSTRUCTIONS,
    },
    {
      icon: <IconCogwheel aria-hidden={true} />,
      label: t('helpPage.sideNavigation.labelTechnology'),
      subLevels: technologySubLevels,
      to: ROUTES.TECHNOLOGY,
    },
  ];

  return (
    <LayoutWithSideNavigation
      className={styles.helpPageLayout}
      levels={levels}
      toggleButtonLabel={t('helpPage.sideNavigation.toggleButtonLabel')}
    >
      {children}
    </LayoutWithSideNavigation>
  );
};

export default HelpPageLayout;
