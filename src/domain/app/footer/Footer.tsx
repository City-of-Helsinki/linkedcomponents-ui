import { ClassNames } from '@emotion/react';
import {
  Footer as HdsFooter,
  Logo,
  logoFi,
  logoFiDark,
  LogoSize,
  logoSv,
  logoSvDark,
} from 'hds-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, PathPattern, useLocation, useNavigate } from 'react-router';

import { DATA_PROTECTION_URL, ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { featureFlagUtils } from '../../../utils/featureFlags';
import skipFalsyType from '../../../utils/skipFalsyType';
import useUser from '../../user/hooks/useUser';
import {
  areAdminRoutesAllowed,
  areRegistrationRoutesAllowed,
} from '../../user/permissions';
import { useTheme } from '../theme/Theme';
import {
  navigationGroupAdmin,
  navigationGroupEvents,
  navigationGroupHome,
  navigationGroupRegistrations,
  navigationGroupSupport,
  navigationGroupTechnology,
  NO_FOOTER_PATHS,
} from './constants';
import styles from './footer.module.scss';
import { getNavigationGroupInstructions } from './utils';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const locale = useLocale();
  /* istanbul ignore next */
  const logoLanguage = locale === 'sv' ? 'sv' : 'fi';
  const isHelpPage = pathname.startsWith(`/${locale}${ROUTES.HELP}`);

  const logo = useMemo(() => {
    if (!isHelpPage) {
      return logoLanguage === 'sv' ? logoSv : logoFi;
    }

    /* istanbul ignore next */
    return logoLanguage === 'sv' ? logoSvDark : logoFiDark;
  }, [isHelpPage, logoLanguage]);

  const getLocalePath = (path: string) => `/${locale}${path}`;

  const goToPage =
    (pathname: string, external?: boolean) =>
    (event?: React.MouseEvent<HTMLAnchorElement>) => {
      event?.preventDefault();

      if (!external) {
        navigate({ pathname });
      } else {
        window.open(pathname, '_blank');
      }
    };

  const getFooterThemeClassName = () => {
    if (isHelpPage) {
      return styles.themeSupport;
    } else {
      return '';
    }
  };

  const isMatch = (paths: PathPattern[]) =>
    paths.some((path) =>
      matchPath(
        { path: `/${locale}${path.path}`, end: path.end ?? true },
        pathname
      )
    );

  const noFooter = isMatch(NO_FOOTER_PATHS);

  if (noFooter) {
    return null;
  }

  return (
    <ClassNames>
      {({ cx }) => (
        <HdsFooter
          className={cx(styles.footer, getFooterThemeClassName())}
          title={t('appName')}
          theme={theme.footer}
        >
          <HdsFooter.Navigation>
            {[
              navigationGroupHome,
              navigationGroupEvents,
              areRegistrationRoutesAllowed(user) &&
                navigationGroupRegistrations,
              featureFlagUtils.isFeatureEnabled('SHOW_ADMIN') &&
                areAdminRoutesAllowed(user) &&
                navigationGroupAdmin,
              navigationGroupSupport,
              getNavigationGroupInstructions(user),
              navigationGroupTechnology,
            ]
              .filter(skipFalsyType)
              .map((group) => (
                <HdsFooter.NavigationGroup
                  key={group.headingLink}
                  headingLink={
                    <HdsFooter.GroupHeading
                      label={t(group.heading)}
                      href={getLocalePath(group.headingLink)}
                      onClick={goToPage(getLocalePath(group.headingLink))}
                    />
                  }
                >
                  {group.items?.map((item) => (
                    <HdsFooter.Link
                      key={getLocalePath(item.url)}
                      href={getLocalePath(item.url)}
                      label={t(item.label)}
                      onClick={goToPage(getLocalePath(item.url))}
                    />
                  ))}
                </HdsFooter.NavigationGroup>
              ))}
          </HdsFooter.Navigation>

          <HdsFooter.Utilities>
            <HdsFooter.Link
              href={DATA_PROTECTION_URL[locale]}
              onClick={goToPage(DATA_PROTECTION_URL[locale], true)}
              label={t('navigation.tabs.dataProtection')}
              external
              target="_blank"
            />
            <HdsFooter.Link
              href={getLocalePath(ROUTES.ACCESSIBILITY_STATEMENT)}
              onClick={goToPage(getLocalePath(ROUTES.ACCESSIBILITY_STATEMENT))}
              label={t('navigation.tabs.accessibilityStatement')}
            />
            <HdsFooter.Link
              href={getLocalePath(ROUTES.COOKIES)}
              onClick={goToPage(getLocalePath(ROUTES.COOKIES))}
              label={t('navigation.tabs.cookies')}
            />
          </HdsFooter.Utilities>
          <HdsFooter.Base
            copyrightHolder={t('footer.copyrightHolder')}
            copyrightText={t('footer.copyrightText')}
            backToTopLabel={t('footer.backToTopLabel')}
            logo={
              <Logo
                src={logo}
                size={LogoSize.Medium}
                alt={t('navigation.logo')}
              />
            }
          />
        </HdsFooter>
      )}
    </ClassNames>
  );
};

export default Footer;
