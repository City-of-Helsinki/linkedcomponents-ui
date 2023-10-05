import { ClassNames } from '@emotion/react';
import { Footer as HdsFooter } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, PathPattern, useLocation, useNavigate } from 'react-router';

import { DATA_PROTECTION_URL, ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { featureFlagUtils } from '../../../utils/featureFlags';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useTheme } from '../theme/Theme';
import styles from './footer.module.scss';

const NO_FOOTER_PATHS: PathPattern[] = [
  { path: ROUTES.ATTENDANCE_LIST },
  { path: ROUTES.EDIT_EVENT },
  { path: ROUTES.EDIT_REGISTRATION },
  { path: ROUTES.EDIT_SIGNUP },
  { path: ROUTES.EDIT_SIGNUP_GROUP },
  { path: ROUTES.REGISTRATION_SIGNUPS },
];

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const locale = useLocale();
  /* istanbul ignore next */
  const logoLanguage = locale === 'sv' ? 'sv' : 'fi';

  const FOOTER_NAVIGATION_ITEMS = [
    { labelKey: 'navigation.tabs.events', url: ROUTES.EVENTS },
    {
      labelKey: 'navigation.searchEvents',
      url: ROUTES.SEARCH,
    },
    featureFlagUtils.isFeatureEnabled('SHOW_REGISTRATION') && {
      labelKey: 'navigation.tabs.registrations',
      url: ROUTES.REGISTRATIONS,
    },
    featureFlagUtils.isFeatureEnabled('SHOW_ADMIN') && {
      labelKey: 'navigation.tabs.admin',
      url: ROUTES.ADMIN,
    },
    { labelKey: 'navigation.tabs.help', url: ROUTES.HELP },
    {
      labelKey: 'navigation.tabs.dataProtection',
      url: DATA_PROTECTION_URL[locale],
      externalUrl: true,
    },
  ].filter(skipFalsyType);

  const navigationItems = FOOTER_NAVIGATION_ITEMS.map(
    ({ labelKey, url, externalUrl }) => ({
      label: t(labelKey),
      url: !externalUrl ? `/${locale}${url}` : url,
      externalUrl,
      target: externalUrl ? '_blank' : '_self',
    })
  );

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
    if (pathname.startsWith(`/${locale}${ROUTES.HELP}`)) {
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
      {({ css, cx }) => (
        <HdsFooter
          className={cx(
            styles.footer,
            css(theme.footer),
            getFooterThemeClassName()
          )}
          logoLanguage={logoLanguage}
          title={t('appName')}
        >
          <HdsFooter.Navigation>
            {navigationItems.map((item) => (
              <HdsFooter.Item
                key={item.url}
                href={item.url}
                label={item.label}
                target={item.target}
                onClick={goToPage(item.url, item.externalUrl)}
              />
            ))}
          </HdsFooter.Navigation>

          <HdsFooter.Utilities backToTopLabel={t('footer.backToTopLabel')}>
            <HdsFooter.Item
              href={`/${locale}${ROUTES.SUPPORT_CONTACT}`}
              onClick={goToPage(`/${locale}${ROUTES.SUPPORT_CONTACT}`)}
              label={t('common.feedback.text')}
            />
          </HdsFooter.Utilities>
          <HdsFooter.Base
            copyrightHolder={t('footer.copyrightHolder')}
            copyrightText={t('footer.copyrightText')}
          />
        </HdsFooter>
      )}
    </ClassNames>
  );
};

export default Footer;
