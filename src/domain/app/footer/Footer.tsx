import classNames from 'classnames';
import { css } from 'emotion';
import { Footer as HdsFooter } from 'hds-react/components/Footer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { NAVIGATION_ITEMS } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { useTheme } from '../theme/Theme';
import styles from './footer.module.scss';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const history = useHistory();
  const locale = useLocale();
  const logoLanguage = locale === 'sv' ? 'sv' : 'fi';

  const navigationItems = NAVIGATION_ITEMS.map(({ labelKey, url }) => ({
    label: t(labelKey),
    url: `/${locale}${url}`,
  }));

  const goToPage = (pathname: string) => (
    event?: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event?.preventDefault();
    history.push({ pathname });
  };

  return (
    <HdsFooter
      className={classNames(styles.footer, css(theme.footer))}
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
          href={t('common.feedback.url')}
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
