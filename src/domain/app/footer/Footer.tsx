import { css } from '@emotion/css';
import classNames from 'classnames';
import { Footer as HdsFooter } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, RouteProps, useHistory, useLocation } from 'react-router';

import { FOOTER_NAVIGATION_ITEMS, ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { useTheme } from '../theme/Theme';
import styles from './footer.module.scss';

interface NoFooterPathProps {
  pathname: string;
  props?: RouteProps;
}

const NO_FOOTER_PATHS = [
  { pathname: ROUTES.EDIT_EVENT },
  { pathname: ROUTES.EDIT_REGISTRATION },
  { pathname: ROUTES.EDIT_REGISTRATION_ENROLMENT },
  { pathname: ROUTES.REGISTRATION_ENROLMENTS },
];

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const history = useHistory();
  const { pathname } = useLocation();
  const locale = useLocale();
  /* istanbul ignore next */
  const logoLanguage = locale === 'sv' ? 'sv' : 'fi';

  const navigationItems = FOOTER_NAVIGATION_ITEMS.map(({ labelKey, url }) => ({
    label: t(labelKey),
    url: `/${locale}${url}`,
  }));

  const goToPage =
    (pathname: string) => (event?: React.MouseEvent<HTMLAnchorElement>) => {
      event?.preventDefault();
      history.push({ pathname });
    };

  const getFooterThemeClassName = () => {
    if (pathname.startsWith(`/${locale}${ROUTES.HELP}`)) {
      return styles.themeSupport;
    } else {
      return '';
    }
  };

  const isMatch = (paths: NoFooterPathProps[]) =>
    paths.some((path) =>
      matchPath(pathname, {
        path: `/${locale}${path.pathname}`,
        exact: path.props?.exact ?? true,
        strict: path.props?.strict ?? true,
      })
    );

  const noFooter = isMatch(NO_FOOTER_PATHS);

  if (noFooter) {
    return null;
  }

  return (
    <HdsFooter
      className={classNames(
        styles.footer,
        css(theme.footer),
        getFooterThemeClassName()
      )}
      logoLanguage={logoLanguage}
      title={t('appName')}
    >
      <HdsFooter.Navigation>
        {navigationItems.map((item, index) => (
          <HdsFooter.Item
            key={index}
            href={item.url}
            label={item.label}
            onClick={goToPage(item.url)}
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
  );
};

export default Footer;
