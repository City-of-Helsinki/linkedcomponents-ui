import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, RouteComponentProps, Switch } from 'react-router';

import { ROUTES } from '../../../constants';
import { Language } from '../../../types';
import EditEventPage from '../../event/EditEventPage';
import EventSavedPage from '../../eventSaved/EventSavedPage';
import EventSearchPage from '../../eventSearch/EventSearchPage';
import LogoutPage from '.././../auth/logoutPage/LogoutPage';
import CreateEventPage from '.././../event/CreateEventPage';
import EventsPage from '.././../events/EventsPage';
import LandingPage from '.././../landingPage/LandingPage';
import NotFound from '.././../notFound/NotFound';
import PageLayout from '../layout/PageLayout';
import HelpPageRoutes from './HelpPageRoutes';

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
          <HelpPageRoutes locale={locale} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </PageLayout>
  );
};

export default LocaleRoutes;
