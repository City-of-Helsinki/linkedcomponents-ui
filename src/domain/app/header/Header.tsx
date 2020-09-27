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

  return (
    <Navigation
      menuOpen={menuOpen}
      onMenuToggle={onMenuToggle}
      menuCloseAriaLabel={t('navigation.menuCloseAriaLabel')}
      menuOpenAriaLabel={t('navigation.menuOpenAriaLabel')}
      skipTo={`${location.pathname}${location.search}#${MAIN_CONTENT_ID}`}
      skipToContentLabel={t('navigation.skipToContentLabel')}
      className={css(theme.navigation)}
      title={t('appName')}
      titleUrl={`/${locale}${ROUTES.HOME}`}
      logoLanguage={locale === 'sv' ? 'sv' : 'fi'}
    >
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
