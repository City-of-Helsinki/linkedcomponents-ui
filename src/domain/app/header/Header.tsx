import classNames from 'classnames';
import { css } from 'emotion';
import { Navigation } from 'hds-react/components/Navigation';
import { IconSignout } from 'hds-react/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import {
  MAIN_CONTENT_ID,
  ROUTES,
  SUPPORTED_LANGUAGES,
} from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { OptionType } from '../../../types';
import updateLocaleParam from '../../../utils/updateLocaleParam';
import { signIn, signOut } from '../../auth/authenticate';
import { authenticatedSelector, userSelector } from '../../auth/selectors';
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
  const authenticated = useSelector(authenticatedSelector);
  const user = useSelector(userSelector);

  const languageOptions: OptionType[] = React.useMemo(() => {
    return Object.values(SUPPORTED_LANGUAGES).map((language) => ({
      label: t(`navigation.languages.${language}`),
      value: language,
    }));
  }, [t]);

  const changeLanguage = (newLanguage: OptionType) => (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    history.push({
      pathname: updateLocaleParam(location.pathname, locale, newLanguage.value),
      search: location.search,
    });
  };

  const goToPage = (pathname: string) => (
    event?: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event?.preventDefault();
    history.push({ pathname });
  };

  const handleSignIn = () => {
    signIn(`${location.pathname}${location.search}`);
  };

  return (
    <Navigation
      menuOpen={menuOpen}
      onMenuToggle={onMenuToggle}
      menuToggleAriaLabel={t('navigation.menuToggleAriaLabel')}
      skipTo={`${location.pathname}${location.search}#${MAIN_CONTENT_ID}`}
      skipToContentLabel={t('navigation.skipToContentLabel')}
      className={classNames(css(theme.navigation), styles.navigation)}
      onTitleClick={goToPage(`/${locale}${ROUTES.HOME}`)}
      title={t('appName')}
      titleUrl={`/${locale}${ROUTES.HOME}`}
      logoLanguage={locale === 'sv' ? 'sv' : 'fi'}
    >
      <Navigation.Actions>
        {/* USER */}
        <Navigation.User
          authenticated={authenticated}
          label={t('common.signIn')}
          onSignIn={handleSignIn}
          userName={user?.profile.name || user?.profile.email}
        >
          <Navigation.Item
            label={t('common.signOut')}
            href="#"
            icon={<IconSignout aria-hidden />}
            variant="supplementary"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              signOut();
            }}
          />
        </Navigation.User>
        <Navigation.LanguageSelector
          buttonAriaLabel={t('navigation.languageSelectorAriaLabel')}
          className={classNames(
            styles.languageSelector,
            css(theme.languageSelector)
          )}
          label={t(`navigation.languages.${locale}`)}
        >
          {languageOptions.map((option) => (
            <Navigation.Item
              key={option.value}
              href="#"
              lang={option.value}
              label={option.label}
              onClick={changeLanguage(option)}
            />
          ))}
        </Navigation.LanguageSelector>
      </Navigation.Actions>
    </Navigation>
  );
};

export default Header;
