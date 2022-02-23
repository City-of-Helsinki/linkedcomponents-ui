import classNames from 'classnames';
import React from 'react';
import { useHistory, useLocation } from 'react-router';

import SideNavigation from '../../../../common/components/sideNavigation/SideNavigation';
import useLocale from '../../../../hooks/useLocale';
import useWindowSize from '../../../../hooks/useWindowSize';
import getPageHeaderHeight from '../../../../utils/getPageHeaderHeight';
import Container from '../Container';
import MainContent from '../MainContent';
import styles from './layoutWithSideNavigation.module.scss';

interface Level {
  icon: React.ReactElement;
  label: string;
  subLevels: SubLevel[];
  to: string;
}

interface SubLevel {
  label: string;
  to: string;
}

interface Props {
  children: React.ReactNode;
  className?: string;
  getIsActive?: (localePath: string) => boolean;
  levels: Level[];
  toggleButtonLabel: string;
}

const LayoutWithSideNavigation: React.FC<Props> = ({
  children,
  className,
  getIsActive: _getIsActive,
  levels,
  toggleButtonLabel,
}) => {
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
    return _getIsActive ? _getIsActive(localePath) : pathname === localePath;
  };

  const handleLinkClick =
    (href: string) => (e: React.MouseEvent | React.KeyboardEvent) => {
      e.preventDefault();
      history.push(href);
    };

  return (
    <div className={styles.pageWrapper}>
      <Container>
        <div className={classNames(styles.layoutWithSideNavigation, className)}>
          <div className={styles.sideNavigationWrapper}>
            <div style={{ top: sideNavigationTop }}>
              <SideNavigation
                className={styles.sideNavigation}
                id="side-navigation"
                toggleButtonLabel={toggleButtonLabel}
              >
                {levels.map(
                  ({ icon, label, subLevels, to }, mainLevelIndex) => {
                    const localePath = getLocalePath(to);
                    return (
                      <SideNavigation.MainLevel
                        key={mainLevelIndex}
                        id={localePath}
                        href={localePath}
                        icon={icon}
                        label={label}
                        onClick={
                          subLevels.length
                            ? undefined
                            : handleLinkClick(localePath)
                        }
                      >
                        {subLevels?.map(({ label, to }, subLevelIndex) => {
                          const localePath = getLocalePath(to);

                          return (
                            <SideNavigation.SubLevel
                              key={subLevelIndex}
                              id={localePath}
                              active={getIsActive(localePath)}
                              href={localePath}
                              label={label}
                              onClick={handleLinkClick(localePath)}
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

export default LayoutWithSideNavigation;