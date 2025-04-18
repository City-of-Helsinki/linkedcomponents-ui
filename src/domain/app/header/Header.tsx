import { ClassNames } from '@emotion/react';
import {
  Header as HDSHeader,
  IconCross,
  IconSignin,
  IconSignout,
  IconUser,
  Link,
  Logo,
  logoFiDark,
  LogoSize,
  logoSvDark,
} from 'hds-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, PathPattern, useLocation, useNavigate } from 'react-router';

import { MAIN_CONTENT_ID, PAGE_HEADER_ID, ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import useSelectLanguage from '../../../hooks/useSelectLanguage';
import { featureFlagUtils } from '../../../utils/featureFlags';
import getUserDisplayName from '../../../utils/getUserDisplayName';
import useAuth from '../../auth/hooks/useAuth';
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
  { pathname: ROUTES.ATTENDANCE_LIST },
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
  const { authenticated, login, logout, user: authUser } = useAuth();

  const { t } = useTranslation();
  const { user } = useUser();

  const displayName = useMemo(
    () => getUserDisplayName({ authUser, authenticated }),
    [authUser, authenticated]
  );

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

  const NAVIGATION_ITEMS = [
    { labelKey: 'navigation.tabs.events', url: ROUTES.EVENTS },
    {
      labelKey: 'navigation.tabs.searchEvents',
      url: ROUTES.SEARCH,
    },
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
  ].filter((i) => i) as NavigationItem[];

  const navigationItems = NAVIGATION_ITEMS.map(
    ({ labelKey, url, ...rest }) => ({
      label: t(labelKey),
      url: `/${locale}${url}`,
      ...rest,
    })
  );

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    login();
  };

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

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
          defaultLanguage={locale}
          id={PAGE_HEADER_ID}
          theme={theme.navigation}
          languages={languageOptions}
          onDidChangeLanguage={changeLanguage}
        >
          <HDSHeader.SkipLink
            skipTo={`#${MAIN_CONTENT_ID}`}
            label={t('navigation.skipToContentLabel')}
          ></HDSHeader.SkipLink>
          <HDSHeader.ActionBar
            title={t('appName')}
            titleHref={`/${locale}${ROUTES.HOME}`}
            onTitleClick={goToHomePage}
            frontPageLabel={t('common.home')}
            logoHref={`/${locale}${ROUTES.HOME}`}
            logo={
              <Logo
                src={locale === 'sv' ? logoSvDark : logoFiDark}
                size={LogoSize.Medium}
                alt={t('navigation.logo')}
              />
            }
            menuButtonAriaLabel={t('navigation.menuToggleAriaLabel')}
          >
            <HDSHeader.LanguageSelector
              ariaLabel={t(`navigation.languages.${locale}`)}
            />
            {authenticated && authUser ? (
              <HDSHeader.ActionBarItem
                fixedRightPosition
                icon={<IconUser aria-hidden />}
                closeIcon={<IconCross aria-hidden />}
                closeLabel={t('common.close')}
                id="action-bar-user"
                label={displayName}
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
                icon={<IconSignin aria-hidden />}
                label={t('common.signIn')}
                closeIcon={<IconCross aria-hidden />}
                closeLabel={t('common.close')}
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
