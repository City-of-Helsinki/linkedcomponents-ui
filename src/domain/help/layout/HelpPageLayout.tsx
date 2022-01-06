import {
  IconCogwheel,
  IconHome,
  IconLayers,
  IconQuestionCircle,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import SideNavigation from '../../../common/components/sideNavigation/SideNavigation';
import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import useWindowSize from '../../../hooks/useWindowSize';
import getPageHeaderHeight from '../../../utils/getPageHeaderHeight';
import Container from '../../app/layout/Container';
import MainContent from '../../app/layout/MainContent';
import styles from './helpPageLayout.module.scss';

interface Props {
  children: React.ReactNode;
}

const HelpPageLayout: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation();
  const [sideNavigationTop, setSideNavigationTop] = React.useState(
    getPageHeaderHeight()
  );
  const windowSize = useWindowSize();
  const locale = useLocale();
  const history = useHistory();
  const { pathname } = useLocation();

  const getLocalePath = (path: string) => `/${locale}${path}`;

  React.useEffect(() => {
    setSideNavigationTop(getPageHeaderHeight());
  }, [windowSize]);

  const getIsActive = (localePath: string) => {
    return pathname === localePath;
  };

  const instructionsSubLevels = [
    {
      label: t('helpPage.sideNavigation.labelGeneral'),
      to: getLocalePath(ROUTES.INSTRUCTIONS_GENERAL),
    },
    {
      label: t('helpPage.sideNavigation.labelPlatform'),
      to: getLocalePath(ROUTES.INSTRUCTIONS_PLATFORM),
    },
    {
      label: t('helpPage.sideNavigation.labelControlPanel'),
      to: getLocalePath(ROUTES.INSTRUCTIONS_CONTROL_PANEL),
    },
    {
      label: t('helpPage.sideNavigation.labelFaq'),
      to: getLocalePath(ROUTES.INSTRUCTIONS_FAQ),
    },
  ];

  const technologySubLevels = [
    {
      label: t('helpPage.sideNavigation.labelGeneral'),
      to: getLocalePath(ROUTES.TECHNOLOGY_GENERAL),
    },
    {
      label: t('helpPage.sideNavigation.labelApi'),
      to: getLocalePath(ROUTES.TECHNOLOGY_API),
    },
    {
      label: t('helpPage.sideNavigation.labelImageRights'),
      to: getLocalePath(ROUTES.TECHNOLOGY_IMAGE_RIGHTS),
    },
    {
      label: t('helpPage.sideNavigation.labelSourceCode'),
      to: getLocalePath(ROUTES.TECHNOLOGY_SOURCE_CODE),
    },
    {
      label: t('helpPage.sideNavigation.labelDocumentation'),
      to: getLocalePath(ROUTES.TECHNOLOGY_DOCUMENTATION),
    },
  ];

  const supportSubLevels = [
    {
      label: t('helpPage.sideNavigation.labelTermsOfUse'),
      to: getLocalePath(ROUTES.SUPPORT_TERMS_OF_USE),
    },
    {
      label: t('helpPage.sideNavigation.labelContact'),
      to: getLocalePath(ROUTES.SUPPORT_CONTACT),
    },
  ];

  const levels = [
    {
      icon: <IconHome />,
      label: t('helpPage.sideNavigation.labelInstructions'),
      subLevels: instructionsSubLevels,
      to: getLocalePath(ROUTES.INSTRUCTIONS),
    },
    {
      icon: <IconCogwheel />,
      label: t('helpPage.sideNavigation.labelTechnology'),
      subLevels: technologySubLevels,
      to: getLocalePath(ROUTES.TECHNOLOGY),
    },
    {
      icon: <IconQuestionCircle />,
      label: t('helpPage.sideNavigation.labelSupport'),
      subLevels: supportSubLevels,
      to: getLocalePath(ROUTES.SUPPORT),
    },
    {
      icon: <IconLayers />,
      label: t('helpPage.sideNavigation.labelFeatures'),
      subLevels: [],
      to: getLocalePath(ROUTES.FEATURES),
    },
  ];

  const handleLinkClick =
    (href: string) =>
    (
      e:
        | React.MouseEvent<HTMLAnchorElement, MouseEvent>
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | React.KeyboardEvent<HTMLAnchorElement>
        | React.KeyboardEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();
      history.push(href);
    };

  return (
    <div className={styles.helpPageWrapper}>
      <Container>
        <div className={styles.helpPageLayout}>
          <div className={styles.sideNavigationWrapper}>
            <div style={{ top: sideNavigationTop }}>
              <SideNavigation
                className={styles.sideNavigation}
                id="side-navigation"
                toggleButtonLabel={t(
                  'helpPage.sideNavigation.toggleButtonLabel'
                )}
              >
                {levels.map(
                  ({ icon, label, subLevels, to }, mainLevelIndex) => {
                    return (
                      <SideNavigation.MainLevel
                        key={mainLevelIndex}
                        id={to}
                        active={getIsActive(to)}
                        href={to}
                        icon={icon}
                        label={label}
                        onClick={
                          subLevels.length ? undefined : handleLinkClick(to)
                        }
                      >
                        {subLevels?.map(({ label, to }, subLevelIndex) => {
                          return (
                            <SideNavigation.SubLevel
                              key={subLevelIndex}
                              id={to}
                              active={getIsActive(to)}
                              href={to}
                              label={label}
                              onClick={handleLinkClick(to)}
                            />
                          );
                        })}
                      </SideNavigation.MainLevel>
                    );
                  }
                )}
              </SideNavigation>
            </div>
          </div>
          <div className={styles.content}>
            <MainContent>{children}</MainContent>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HelpPageLayout;
