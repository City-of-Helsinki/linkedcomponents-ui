import { css } from '@emotion/css';
import classNames from 'classnames';
import { IconInfoCircle, IconSignout, Navigation } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { matchPath, RouteProps, useHistory, useLocation } from 'react-router';

import { MAIN_CONTENT_ID, PAGE_HEADER_ID, ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import useSelectLanguage from '../../../hooks/useSelectLanguage';
import { isFeatureEnabled } from '../../../utils/featureFlags';
import { signIn, signOut } from '../../auth/authenticate';
import { authenticatedSelector } from '../../auth/selectors';
import { getEventSearchQuery } from '../../eventSearch/utils';
import useUser from '../../user/hooks/useUser';
import { useTheme } from '../theme/Theme';
import styles from './header.module.scss';

interface NoNavRowProps {
  pathname: string;
  props?: RouteProps;
}

interface NavigationItem {
  className?: string;
  icon?: React.ReactElement;
  labelKey: string;
  url: ROUTES;
}

const NO_NAV_ROW_PATHS = [
  { pathname: ROUTES.EDIT_EVENT },
  { pathname: ROUTES.EDIT_REGISTRATION },
  { pathname: ROUTES.EDIT_REGISTRATION_ENROLMENT },
  { pathname: ROUTES.REGISTRATION_ENROLMENTS },
];

const SCROLL_OFFSET = 40;

const Header: React.FC = () => {
  const { theme } = useTheme();
  const locale = useLocale();
  const history = useHistory();
  const location = useLocation();
  const { changeLanguage, languageOptions } = useSelectLanguage();

  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const user = useUser();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const isTabActive = (pathname: string): boolean => {
    return location.pathname.startsWith(pathname);
  };

  const goToHomePage = (e?: Event) => {
    e?.preventDefault();
    history.push({ pathname: `/${locale}${ROUTES.HOME}` });
    setMenuOpen(false);
  };

  const goToPage =
    (pathname: string) => (e?: React.MouseEvent<HTMLAnchorElement>) => {
      e?.preventDefault();
      history.push({ pathname });
      toggleMenu();
    };

  const NAVIGATION_ITEMS = [
    { labelKey: 'navigation.tabs.events', url: ROUTES.EVENTS },
    isFeatureEnabled('SHOW_REGISTRATION') && {
      labelKey: 'navigation.tabs.registrations',
      url: ROUTES.REGISTRATIONS,
    },
    isFeatureEnabled('SHOW_ADMIN') && {
      labelKey: 'navigation.tabs.admin',
      url: ROUTES.ADMIN,
    },
    {
      className: styles.navigationItemLast,
      icon: <IconInfoCircle aria-hidden={true} />,
      labelKey: 'navigation.tabs.help',
      url: ROUTES.HELP,
    },
  ].filter((i) => i) as NavigationItem[];

  const navigationItems = NAVIGATION_ITEMS.map(
    ({ labelKey, url, ...rest }) => ({
      label: t(labelKey),
      url: `/${locale}${url}`,
      ...rest,
    })
  );

  const handleSignIn = () => {
    signIn(`${location.pathname}${location.search}`);
  };

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut();
  };

  const isMatch = (paths: NoNavRowProps[]) =>
    paths.some((path) =>
      matchPath(location.pathname, {
        path: `/${locale}${path.pathname}`,
        exact: path.props?.exact ?? true,
        strict: path.props?.strict ?? true,
      })
    );

  const noNavRow = isMatch(NO_NAV_ROW_PATHS);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearch = (text: string) => {
    history.push({
      pathname: `/${locale}${ROUTES.SEARCH}`,
      search: getEventSearchQuery({ text }),
    });
    toggleMenu();
  };

  /* istanbul ignore next */
  const onDocumentFocusin = (event: FocusEvent) => {
    const target = event.target;
    const navigation = document.querySelector(`#${PAGE_HEADER_ID}`);

    if (
      target instanceof HTMLElement &&
      navigation instanceof HTMLElement &&
      !navigation.contains(target)
    ) {
      const navigationRect = navigation.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      if (navigationRect && navigationRect.bottom > targetRect.top) {
        window.scrollBy(
          0,
          targetRect.top - navigationRect.bottom - SCROLL_OFFSET
        );
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('focusin', onDocumentFocusin);

    return () => {
      document.removeEventListener('focusin', onDocumentFocusin);
    };
  });

  return (
    <Navigation
      id={PAGE_HEADER_ID}
      menuOpen={menuOpen}
      onMenuToggle={toggleMenu}
      menuToggleAriaLabel={t('navigation.menuToggleAriaLabel')}
      skipTo={`#${MAIN_CONTENT_ID}`}
      skipToContentLabel={t('navigation.skipToContentLabel')}
      className={classNames(css(theme.navigation), styles.navigation, {
        [styles.hideNavRow]: noNavRow,
      })}
      onTitleClick={goToHomePage}
      title={t('appName')}
      titleUrl={`/${locale}${ROUTES.HOME}`}
      logoLanguage={locale === 'sv' ? /* istanbul ignore next */ 'sv' : 'fi'}
    >
      <Navigation.Row>
        {navigationItems.map((item, index) => (
          <Navigation.Item
            key={index}
            active={isTabActive(item.url)}
            className={classNames(styles.navigationItem, item.className)}
            icon={item.icon}
            href={item.url}
            label={item.label}
            onClick={goToPage(item.url)}
          />
        ))}
      </Navigation.Row>
      <Navigation.Actions>
        <Navigation.Search
          onSearch={handleSearch}
          searchLabel={t('navigation.searchEvents')}
        />
        {/* USER */}
        <Navigation.User
          authenticated={Boolean(authenticated && user.user)}
          className={classNames(
            styles.userDropdown,
            css(theme.navigationDropdown)
          )}
          label={t('common.signIn')}
          onSignIn={handleSignIn}
          userName={user?.user?.displayName || user?.user?.email}
        >
          <Navigation.Item
            label={t('common.signOut')}
            href="#"
            icon={<IconSignout aria-hidden />}
            variant="supplementary"
            onClick={handleSignOut}
          />
        </Navigation.User>
        <Navigation.LanguageSelector
          buttonAriaLabel={t('navigation.languageSelectorAriaLabel')}
          className={classNames(
            styles.languageSelector,
            css(theme.navigationDropdown)
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
