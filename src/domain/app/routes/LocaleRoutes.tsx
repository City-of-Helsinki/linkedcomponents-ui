import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, RouteComponentProps, Switch } from 'react-router';

import { ROUTES } from '../../../constants';
import { Language } from '../../../types';
import EventSavedPage from '../../eventCreated/EventSavedPage';
import LogoutPage from '.././../auth/logoutPage/LogoutPage';
import CreateEventPage from '.././../event/CreateEventPage';
import EventsPage from '.././../events/EventsPage';
import HelpPage from '.././../help/HelpPage';
import LandingPage from '.././../landingPage/LandingPage';
import PageLayout from '../layout/PageLayout';

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

  const getLocelePath = (path: string) => `/${locale}${path}`;

  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [i18n, locale]);

  return (
    <PageLayout>
      <Switch>
        <Route
          exact
          path={getLocelePath(ROUTES.HOME)}
          component={LandingPage}
        />
        <Route
          exact
          path={getLocelePath(ROUTES.CREATE_EVENT)}
          component={CreateEventPage}
        />
        <Route
          exact
          path={getLocelePath(ROUTES.EVENT_SAVED)}
          component={EventSavedPage}
        />
        <Route
          exact
          path={getLocelePath(ROUTES.EVENTS)}
          component={EventsPage}
        />
        <Route
          exact
          path={getLocelePath(ROUTES.LOGOUT)}
          component={LogoutPage}
        />
        <Route
          exact
          path={getLocelePath(ROUTES.SEARCH)}
          component={EventsPage}
        />
        <Route exact path={getLocelePath(ROUTES.HELP)} component={HelpPage} />
      </Switch>
    </PageLayout>
  );
};

export default LocaleRoutes;
