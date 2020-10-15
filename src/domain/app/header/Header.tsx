import classNames from 'classnames';
import { css } from 'emotion';
import { Navigation } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import {
  MAIN_CONTENT_ID,
  ROUTES,
  SUPPORTED_LANGUAGES,
} from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { OptionType } from '../../../types';
import updateLocaleParam from '../../../utils/updateLocaleParam';
import { useTheme } from '../theme/Theme';
import styles from './header.module.scss';

export interface HeaderProps {
  menuOpen: boolean;
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ menuOpen, onMenuToggle }) => {
  const { theme } = useTheme();
  const locale = useLocale();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const languageOptions: OptionType[] = React.useMemo(() => {
    return Object.values(SUPPORTED_LANGUAGES).map((language) => ({
      label: t(`navigation.languages.${language}`),
      value: language,
    }));
  }, [t]);

  const formatSelectedValue = ({ value }: OptionType): string =>
    value.toUpperCase();

  const changeLanguage = (newLanguage: OptionType) => {
    history.push({
      pathname: updateLocaleParam(location.pathname, locale, newLanguage.value),
      search: location.search,
    });
  };

  const isTabActive = (pathname: string): boolean => {
    return location.pathname.startsWith(pathname);
  };

  const goToPage = (pathname: string) => (
    event?: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event?.preventDefault();
    history.push({ pathname });
  };

  const navigationItems = [
    {
      label: t('navigation.tabs.createEvent'),
      url: `/${locale}${ROUTES.CREATE_EVENT}`,
    },
    {
      label: t('navigation.tabs.searchEvent'),
      url: `/${locale}${ROUTES.SEARCH}`,
    },
    {
      label: t('navigation.tabs.help'),
      url: `/${locale}${ROUTES.HELP}`,
    },
  ];

  return (
    <Navigation
      menuOpen={menuOpen}
      onMenuToggle={onMenuToggle}
      menuCloseAriaLabel={t('navigation.menuCloseAriaLabel')}
      menuOpenAriaLabel={t('navigation.menuOpenAriaLabel')}
      skipTo={`${location.pathname}${location.search}#${MAIN_CONTENT_ID}`}
      skipToContentLabel={t('navigation.skipToContentLabel')}
      className={classNames(css(theme.navigation), styles.navigation)}
      onTitleClick={goToPage(`/${locale}${ROUTES.HOME}`)}
      title={t('appName')}
      titleUrl={`/${locale}${ROUTES.HOME}`}
      logoLanguage={locale === 'sv' ? 'sv' : 'fi'}
    >
      <Navigation.Row>
        {navigationItems.map((item, index) => (
          <Navigation.Item
            key={index}
            active={isTabActive(item.url)}
            href={item.url}
            label={item.label}
            onClick={goToPage(item.url)}
          />
        ))}
      </Navigation.Row>
      <Navigation.Actions>
        <Navigation.LanguageSelector
          ariaLabel={t('navigation.languageSelectorAriaLabel')}
          className={css(theme.languageSelector)}
          formatSelectedValue={formatSelectedValue}
          onLanguageChange={changeLanguage}
          options={languageOptions}
          value={
            languageOptions.find((item) => locale === item.value) as OptionType
          }
        />
      </Navigation.Actions>
    </Navigation>
  );
};

export default Header;
