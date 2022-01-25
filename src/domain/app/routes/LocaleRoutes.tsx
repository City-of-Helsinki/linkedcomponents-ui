import React from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';

import { DEPRECATED_ROUTES, ROUTES } from '../../../constants';
import { Language } from '../../../types';
import { isFeatureEnabled } from '../../../utils/featureFlags';
import EventSavedPage from '../../eventSaved/EventSavedPage';
import HelpPageLayout from '../../help/layout/HelpPageLayout';
import RegistrationSavedPage from '../../registrationSaved/RegistrationSavedPage';
import LogoutPage from '.././../auth/logoutPage/LogoutPage';
import LandingPage from '.././../landingPage/LandingPage';
import NotFound from '.././../notFound/NotFound';
import PageLayout from '../layout/PageLayout';

const CreateEnrolmentPage = React.lazy(
  () => import('.././../enrolment/CreateEnrolmentPage')
);
const CreateEventPage = React.lazy(
  () => import('.././../event/CreateEventPage')
);
const CreateKeywordPage = React.lazy(
  () => import('.././../keyword/CreateKeywordPage')
);
const CreateRegistrationPage = React.lazy(
  () => import('.././../registration/CreateRegistrationPage')
);
const EditEnrolmentPage = React.lazy(
  () => import('../../enrolment/EditEnrolmentPage')
);
const EditEventPage = React.lazy(() => import('../../event/EditEventPage'));
const EditRegistrationPage = React.lazy(
  () => import('../../registration/EditRegistrationPage')
);
const EnrolmentsPage = React.lazy(
  () => import('../../enrolments/EnrolmentsPage')
);
const EventsPage = React.lazy(() => import('.././../events/EventsPage'));
const EventSearchPage = React.lazy(
  () => import('../../eventSearch/EventSearchPage')
);
const HelpPageRoutes = React.lazy(() => import('./HelpPageRoutes'));
const KeywordsPage = React.lazy(() => import('.././../keywords/KeywordsPage'));
const RegistrationsPage = React.lazy(
  () => import('.././../registrations/RegistrationsPage')
);

interface Params {
  locale: Language;
}

type Props = RouteComponentProps<Params>;

const LocaleRoutes: React.FC<Props> = ({
  match: {
    params: { locale },
  },
}) => {
  const { i18n } = useTranslation();

  const getLocalePath = (path: string) => `/${locale}${path}`;

  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [i18n, locale]);

  return (
    <PageLayout>
      <React.Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <Switch>
          {/* Redirect old UI routes */}
          <Redirect
            from={getLocalePath(DEPRECATED_ROUTES.CREATE_EVENT)}
            to={getLocalePath(ROUTES.CREATE_EVENT)}
          />
          <Redirect
            from={getLocalePath(DEPRECATED_ROUTES.MODERATION)}
            to={getLocalePath(ROUTES.EVENTS)}
          />
          <Redirect
            from={getLocalePath(DEPRECATED_ROUTES.UPDATE_EVENT)}
            to={getLocalePath(ROUTES.EDIT_EVENT)}
          />
          <Redirect
            from={getLocalePath(DEPRECATED_ROUTES.VIEW_EVENT)}
            to={getLocalePath(ROUTES.EDIT_EVENT)}
          />
          <Redirect
            from={getLocalePath(DEPRECATED_ROUTES.TERMS)}
            to={getLocalePath(ROUTES.SUPPORT_TERMS_OF_USE)}
          />
          {/* Locale routes */}
          <Route
            exact
            path={getLocalePath(ROUTES.HOME)}
            component={LandingPage}
          />
          <Route
            exact
            path={getLocalePath(ROUTES.CREATE_EVENT)}
            component={CreateEventPage}
          />
          <Route
            exact
            path={getLocalePath(ROUTES.EVENT_SAVED)}
            component={EventSavedPage}
          />
          <Route
            exact
            path={getLocalePath(ROUTES.EDIT_EVENT)}
            component={EditEventPage}
          />
          <Route
            exact
            path={getLocalePath(ROUTES.EVENTS)}
            component={EventsPage}
          />
          {isFeatureEnabled('SHOW_REGISTRATION') && (
            <Route
              exact
              path={getLocalePath(ROUTES.CREATE_REGISTRATION)}
              component={CreateRegistrationPage}
            />
          )}
          {isFeatureEnabled('SHOW_REGISTRATION') && (
            <Route
              exact
              path={getLocalePath(ROUTES.REGISTRATION_SAVED)}
              component={RegistrationSavedPage}
            />
          )}
          {isFeatureEnabled('SHOW_REGISTRATION') && (
            <Route
              exact
              path={getLocalePath(ROUTES.EDIT_REGISTRATION)}
              component={EditRegistrationPage}
            />
          )}
          {isFeatureEnabled('SHOW_REGISTRATION') && (
            <Route
              exact
              path={getLocalePath(ROUTES.REGISTRATIONS)}
              component={RegistrationsPage}
            />
          )}
          {isFeatureEnabled('SHOW_REGISTRATION') && (
            <Route
              exact
              path={getLocalePath(ROUTES.REGISTRATION_ENROLMENTS)}
              component={EnrolmentsPage}
            />
          )}
          {isFeatureEnabled('SHOW_REGISTRATION') && (
            <Route
              exact
              path={getLocalePath(ROUTES.CREATE_ENROLMENT)}
              component={CreateEnrolmentPage}
            />
          )}
          {isFeatureEnabled('SHOW_REGISTRATION') && (
            <Route
              exact
              path={getLocalePath(ROUTES.EDIT_REGISTRATION_ENROLMENT)}
              component={EditEnrolmentPage}
            />
          )}
          {isFeatureEnabled('SHOW_KEYWORD') && (
            <Route
              exact
              path={getLocalePath(ROUTES.CREATE_KEYWORD)}
              component={CreateKeywordPage}
            />
          )}
          {isFeatureEnabled('SHOW_KEYWORD') && (
            <Route
              exact
              path={getLocalePath(ROUTES.KEYWORDS)}
              component={KeywordsPage}
            />
          )}
          <Route
            exact
            path={getLocalePath(ROUTES.LOGOUT)}
            component={LogoutPage}
          />
          <Route
            exact
            path={getLocalePath(ROUTES.SEARCH)}
            component={EventSearchPage}
          />
          <Route path={getLocalePath(ROUTES.HELP)}>
            <HelpPageLayout>
              <HelpPageRoutes locale={locale} />
            </HelpPageLayout>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </React.Suspense>
    </PageLayout>
  );
};

export default LocaleRoutes;
