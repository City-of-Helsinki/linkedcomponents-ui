import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes, useParams } from 'react-router';

import { DEPRECATED_ROUTES, ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { featureFlagUtils } from '../../../../utils/featureFlags';
import getValue from '../../../../utils/getValue';
import AdminPageLayout from '../../../admin/layout/AdminPageLayout';
import LogoutPage from '../../../auth/logoutPage/LogoutPage';
import EventSavedPage from '../../../eventSaved/EventSavedPage';
import HelpPageLayout from '../../../help/layout/HelpPageLayout';
import LandingPage from '../../../landingPage/LandingPage';
import NotFound from '../../../notFound/NotFound';
import RegistrationSavedPage from '../../../registrationSaved/RegistrationSavedPage';
import PageLayout from '../../layout/pageLayout/PageLayout';
import AdminPageRoutes from '../adminRoutes/AdminRoutes';

const AttendanceListPage = React.lazy(
  () => import('../../../attendanceList/AttendanceListPage')
);
const CreateEventPage = React.lazy(
  () => import('../../../event/CreateEventPage')
);
const CreateRegistrationPage = React.lazy(
  () => import('../../../registration/CreateRegistrationPage')
);
const CreateSignupGroupPage = React.lazy(
  () => import('../../../signupGroup/CreateSignupGroupPage')
);

const EditEventPage = React.lazy(() => import('../../../event/EditEventPage'));
const EditRegistrationPage = React.lazy(
  () => import('../../../registration/EditRegistrationPage')
);
const EditSignupGroupPage = React.lazy(
  () => import('../../../signupGroup/EditSignupGroupPage')
);
const EditSignupPage = React.lazy(
  () => import('../../../signup/EditSignupPage')
);
const SignupsPage = React.lazy(() => import('../../../signups/SignupsPage'));
const EventsPage = React.lazy(() => import('../../../events/EventsPage'));
const EventSearchPage = React.lazy(
  () => import('../../../eventSearch/EventSearchPage')
);
const HelpPageRoutes = React.lazy(
  () => import('../helpPageRoutes/HelpPageRoutes')
);
const RegistrationsPage = React.lazy(
  () => import('../../../registrations/RegistrationsPage')
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
            <>
              <Route
                path={ROUTES.CREATE_REGISTRATION}
                element={<CreateRegistrationPage />}
              />
              <Route
                path={ROUTES.REGISTRATION_SAVED}
                element={<RegistrationSavedPage />}
              />
              <Route
                path={ROUTES.EDIT_REGISTRATION}
                element={<EditRegistrationPage />}
              />
              <Route
                path={ROUTES.REGISTRATIONS}
                element={<RegistrationsPage />}
              />
              <Route
                path={ROUTES.REGISTRATION_SIGNUPS}
                element={<SignupsPage />}
              />
              <Route
                path={ROUTES.ATTENDANCE_LIST}
                element={<AttendanceListPage />}
              />
              <Route
                path={ROUTES.CREATE_SIGNUP_GROUP}
                element={<CreateSignupGroupPage />}
              />
              <Route
                path={ROUTES.EDIT_SIGNUP_GROUP}
                element={<EditSignupGroupPage />}
              />
              <Route path={ROUTES.EDIT_SIGNUP} element={<EditSignupPage />} />
            </>
          )}
          <Route path={ROUTES.LOGOUT} element={<LogoutPage />} />
          <Route path={ROUTES.SEARCH} element={<EventSearchPage />} />
          {featureFlagUtils.isFeatureEnabled('SHOW_ADMIN') && (
            <Route
              path={`${ROUTES.ADMIN}/*`}
              element={
                <AdminPageLayout>
                  <AdminPageRoutes />
                </AdminPageLayout>
              }
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
