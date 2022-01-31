import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { ROUTES } from '../../../constants';
import { Language } from '../../../types';

const CreateKeywordPage = React.lazy(
  () => import('.././../keyword/CreateKeywordPage')
);
const EditKeywordPage = React.lazy(
  () => import('../../keyword/EditKeywordPage')
);
const KeywordsPage = React.lazy(() => import('.././../keywords/KeywordsPage'));

interface Props {
  locale: Language;
}

const AdminPageRoutes: React.FC<Props> = ({ locale }) => {
  const getLocalePath = (path: string) => `/${locale}${path}`;

  return (
    <Switch>
      <Redirect
        exact
        path={getLocalePath(ROUTES.ADMIN)}
        to={getLocalePath(ROUTES.KEYWORDS)}
      />
      <Route
        exact
        path={getLocalePath(ROUTES.CREATE_KEYWORD)}
        component={CreateKeywordPage}
      />
      <Route
        exact
        path={getLocalePath(ROUTES.EDIT_KEYWORD)}
        component={EditKeywordPage}
      />
      <Route
        exact
        path={getLocalePath(ROUTES.KEYWORDS)}
        component={KeywordsPage}
      />
    </Switch>
  );
};

export default AdminPageRoutes;
