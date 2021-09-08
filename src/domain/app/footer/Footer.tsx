import { css } from '@emotion/css';
import classNames from 'classnames';
import { Footer as HdsFooter } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import { FOOTER_NAVIGATION_ITEMS, ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { useTheme } from '../theme/Theme';
import styles from './footer.module.scss';

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

  const hideFooter =
    pathname.startsWith(`/${locale}${ROUTES.EDIT_EVENT.replace(':id', '')}`) ||
    pathname.startsWith(
      `/${locale}${ROUTES.EDIT_REGISTRATION.replace(':id', '')}`
    );

  if (hideFooter) {
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
