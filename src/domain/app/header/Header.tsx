import { ClassNames } from '@emotion/react';
import {
  Header as HDSHeader,
  IconCross,
  IconSearch,
  IconSignin,
  IconSignout,
  IconUser,
  Link,
  Logo,
  logoFiDark,
  logoSvDark,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, PathPattern, useLocation, useNavigate } from 'react-router';

import { MAIN_CONTENT_ID, PAGE_HEADER_ID, ROUTES } from '../../../constants';
import useIsMobile from '../../../hooks/useIsMobile';
import useLocale from '../../../hooks/useLocale';
import useSelectLanguage from '../../../hooks/useSelectLanguage';
import { featureFlagUtils } from '../../../utils/featureFlags';
import { useAuth } from '../../auth/hooks/useAuth';
import useUser from '../../user/hooks/useUser';
import {
  areAdminRoutesAllowed,
  areRegistrationRoutesAllowed,
} from '../../user/permissions';
import { useTheme } from '../theme/Theme';
import styles from './header.module.scss';

interface NoNavRowProps {
  pathname: string;
  props?: PathPattern;
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
  { pathname: ROUTES.EDIT_SIGNUP },
  { pathname: ROUTES.EDIT_SIGNUP_GROUP },
  { pathname: ROUTES.REGISTRATION_SIGNUPS },
];

const SCROLL_OFFSET = 40;

const Header: React.FC = () => {
  const { theme } = useTheme();
  const locale = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const { changeLanguage, languageOptions } = useSelectLanguage();
  const { isAuthenticated: authenticated, signIn, signOut } = useAuth();
  const isMobile = useIsMobile();

  const { t } = useTranslation();
  const { user } = useUser();

  const isTabActive = (pathname: string): boolean => {
    return location.pathname.startsWith(pathname);
  };

  const goToHomePage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    navigate({ pathname: `/${locale}${ROUTES.HOME}` });
  };

  const goToPage =
    (pathname: string) => (e?: React.MouseEvent<HTMLAnchorElement>) => {
      e?.preventDefault();
      navigate({ pathname });
    };

  const MOBILE_NAVIGATION_ITEMS = [
    {
      labelKey: 'navigation.tabs.searchEvents',
      url: ROUTES.SEARCH,
    },
  ];

  const NAVIGATION_ITEMS = [
    { labelKey: 'navigation.tabs.events', url: ROUTES.EVENTS },
    featureFlagUtils.isFeatureEnabled('SHOW_REGISTRATION') &&
      areRegistrationRoutesAllowed(user) && {
        labelKey: 'navigation.tabs.registrations',
        url: ROUTES.REGISTRATIONS,
      },
    featureFlagUtils.isFeatureEnabled('SHOW_ADMIN') &&
      areAdminRoutesAllowed(user) && {
        labelKey: 'navigation.tabs.admin',
        url: ROUTES.ADMIN,
      },
    {
      labelKey: 'navigation.tabs.help',
      url: ROUTES.HELP,
    },
    ...(isMobile ? MOBILE_NAVIGATION_ITEMS : []),
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

  const handleSearch = () =>
    navigate({
      pathname: `/${locale}${ROUTES.SEARCH}`,
    });

  const isMatch = (paths: NoNavRowProps[]) =>
    paths.some((path) =>
      matchPath(
        { path: `/${locale}${path.pathname}`, end: path.props?.end ?? true },
        location.pathname
      )
    );

  const noNavRow = isMatch(NO_NAV_ROW_PATHS);

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
    <ClassNames>
      {({ cx }) => (
        <HDSHeader
          className={cx(styles.navigation, {
            [styles.hideNavRow]: noNavRow,
          })}
          id={PAGE_HEADER_ID}
          theme={theme.navigation}
          languages={languageOptions}
          onDidChangeLanguage={(language) => changeLanguage(language)}
        >
          <HDSHeader.SkipLink
            skipTo={`#${MAIN_CONTENT_ID}`}
            label={t('navigation.skipToContentLabel')}
          ></HDSHeader.SkipLink>
          <HDSHeader.ActionBar
            title={t('appName')}
            titleHref={`/${locale}${ROUTES.HOME}`}
            onTitleClick={(event) => goToHomePage(event)}
            frontPageLabel={t('common.home')}
            logoHref={`/${locale}${ROUTES.HOME}`}
            logo={
              <Logo
                src={locale === 'sv' ? logoSvDark : logoFiDark}
                size="medium"
                alt={t('navigation.logo')}
              />
            }
            menuButtonAriaLabel={t('navigation.menuToggleAriaLabel')}
          >
            <HDSHeader.LanguageSelector
              ariaLabel={t(`navigation.languages.${locale}`)}
            />
            {!isMobile && (
              <HDSHeader.ActionBarItem
                icon={<IconSearch />}
                label={t('navigation.tabs.searchEvents')}
                id="action-bar-search-events"
                onClick={handleSearch}
              />
            )}
            {Boolean(authenticated && user) ? (
              <HDSHeader.ActionBarItem
                fixedRightPosition
                icon={<IconUser ariaHidden />}
                closeIcon={<IconCross ariaHidden />}
                id="action-bar-user"
                label={user?.firstName || ''}
              >
                <Link
                  href="#"
                  onClick={handleSignOut}
                  className={styles.signoutLink}
                >
                  <IconSignout aria-hidden />
                  {t('common.signOut')}
                </Link>
              </HDSHeader.ActionBarItem>
            ) : (
              <HDSHeader.ActionBarItem
                fixedRightPosition
                icon={<IconSignin ariaHidden />}
                label={t('common.signIn')}
                id="action-bar-sign-in"
                onClick={handleSignIn}
              />
            )}
          </HDSHeader.ActionBar>
          <HDSHeader.NavigationMenu>
            {navigationItems.map((item) => (
              <HDSHeader.Link
                key={item.url}
                active={isTabActive(item.url)}
                className={cx(styles.navigationItem, item.className)}
                href={item.url}
                label={item.label}
                onClick={goToPage(item.url)}
              />
            ))}
          </HDSHeader.NavigationMenu>
        </HDSHeader>
      )}
    </ClassNames>
  );
};

export default Header;
