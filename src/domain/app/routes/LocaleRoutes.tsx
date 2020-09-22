import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, RouteComponentProps, Switch } from 'react-router';

import { ROUTES } from '../../../constants';
import { Language } from '../../../types';
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

  const getLocelePath = (path: string) => `/${locale}`;

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
      </Switch>
    </PageLayout>
  );
};

export default LocaleRoutes;
