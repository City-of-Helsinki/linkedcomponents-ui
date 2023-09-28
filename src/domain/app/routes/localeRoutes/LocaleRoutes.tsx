import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes, useParams } from 'react-router';

import { DEPRECATED_ROUTES, ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { featureFlagUtils } from '../../../../utils/featureFlags';
import getValue from '../../../../utils/getValue';
import LogoutPage from '../../../auth/logoutPage/LogoutPage';
import EventSavedPage from '../../../eventSaved/EventSavedPage';
import HelpPageLayout from '../../../help/layout/HelpPageLayout';
import LandingPage from '../../../landingPage/LandingPage';
import NotFound from '../../../notFound/NotFound';
import PageLayout from '../../layout/pageLayout/PageLayout';
import AdminPageRoutes from '../adminRoutes/AdminRoutes';
import RegistrationRoutes from '../registrationRoutes/RegistrationRoutes';

const CreateEventPage = React.lazy(
  () => import('../../../event/CreateEventPage')
);

const EditEventPage = React.lazy(() => import('../../../event/EditEventPage'));

const EventsPage = React.lazy(() => import('../../../events/EventsPage'));
const EventSearchPage = React.lazy(
  () => import('../../../eventSearch/EventSearchPage')
);
const HelpPageRoutes = React.lazy(
  () => import('../helpPageRoutes/HelpPageRoutes')
);

const DeprecetedEditEventPageRoute = () => {
  const locale = useLocale();
  const { id } = useParams<{ id: string }>();

  const getLocalePath = (path: string) => `/${locale}${path}`;

  return (
    <Navigate
      replace
      to={getLocalePath(ROUTES.EDIT_EVENT).replace(':id', getValue(id, ''))}
    />
  );
};

const LocaleRoutes: React.FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const { i18n } = useTranslation();

  const getLocalePath = (path: string) => `/${locale}${path}`;

  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [i18n, locale]);

  return (
    <PageLayout>
      <React.Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <Routes>
          {/* Redirect old UI routes */}
          <Route
            path={DEPRECATED_ROUTES.CREATE_EVENT}
            element={
              <Navigate replace to={getLocalePath(ROUTES.CREATE_EVENT)} />
            }
          />
          <Route
            path={DEPRECATED_ROUTES.MODERATION}
            element={<Navigate replace to={getLocalePath(ROUTES.EVENTS)} />}
          />
          <Route
            path={DEPRECATED_ROUTES.UPDATE_EVENT}
            element={<DeprecetedEditEventPageRoute />}
          />
          <Route
            path={DEPRECATED_ROUTES.VIEW_EVENT}
            element={<DeprecetedEditEventPageRoute />}
          />
          <Route
            path={DEPRECATED_ROUTES.TERMS}
            element={
              <Navigate
                replace
                to={getLocalePath(ROUTES.SUPPORT_TERMS_OF_USE)}
              />
            }
          />
          {/* Locale routes */}
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route path={ROUTES.CREATE_EVENT} element={<CreateEventPage />} />
          <Route path={ROUTES.EVENT_SAVED} element={<EventSavedPage />} />
          <Route path={ROUTES.EDIT_EVENT} element={<EditEventPage />} />
          <Route path={ROUTES.EVENTS} element={<EventsPage />} />
          {featureFlagUtils.isFeatureEnabled('SHOW_REGISTRATION') && (
            <Route
              path={`${ROUTES.REGISTRATIONS}/*`}
              element={<RegistrationRoutes />}
            ></Route>
          )}
          <Route path={ROUTES.LOGOUT} element={<LogoutPage />} />
          <Route path={ROUTES.SEARCH} element={<EventSearchPage />} />
          {featureFlagUtils.isFeatureEnabled('SHOW_ADMIN') && (
            <Route
              path={`${ROUTES.ADMIN}/*`}
              element={<AdminPageRoutes />}
            ></Route>
          )}
          <Route
            path={`${ROUTES.HELP}/*`}
            element={
              <HelpPageLayout>
                <HelpPageRoutes />
              </HelpPageLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </PageLayout>
  );
};

export default LocaleRoutes;
