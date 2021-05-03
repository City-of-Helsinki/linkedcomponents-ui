import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, RouteComponentProps, Switch } from 'react-router';

import { ROUTES } from '../../../constants';
import { Language } from '../../../types';
import EventSavedPage from '../../eventSaved/EventSavedPage';
import HelpPageLayout from '../../help/layout/HelpPageLayout';
import LogoutPage from '.././../auth/logoutPage/LogoutPage';
import LandingPage from '.././../landingPage/LandingPage';
import NotFound from '.././../notFound/NotFound';
import PageLayout from '../layout/PageLayout';

const CreateEventPage = React.lazy(
  () => import('.././../event/CreateEventPage')
);
const EditEventPage = React.lazy(() => import('../../event/EditEventPage'));
const EventsPage = React.lazy(() => import('.././../events/EventsPage'));
const EventSearchPage = React.lazy(
  () => import('../../eventSearch/EventSearchPage')
);
const HelpPageRoutes = React.lazy(() => import('./HelpPageRoutes'));

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
