import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { ROUTES } from '../../../constants';
import { Language } from '../../../types';
import NotFoundPage from '../../notFound/NotFound';

const CreateKeywordPage = React.lazy(
  () => import('.././../keyword/CreateKeywordPage')
);
const CreateKeywordSetPage = React.lazy(
  () => import('.././../keywordSet/CreateKeywordSetPage')
);
const EditKeywordPage = React.lazy(
  () => import('../../keyword/EditKeywordPage')
);
const EditKeywordSetPage = React.lazy(
  () => import('../../keywordSet/EditKeywordSetPage')
);
const KeywordsPage = React.lazy(() => import('.././../keywords/KeywordsPage'));
const KeywordSetsPage = React.lazy(
  () => import('.././../keywordSets/KeywordSetsPage')
);

const OrganizationsPage = React.lazy(
  () => import('.././../organizations/OrganizationsPage')
);

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

      <Route
        exact
        path={getLocalePath(ROUTES.CREATE_KEYWORD_SET)}
        component={CreateKeywordSetPage}
      />
      <Route
        exact
        path={getLocalePath(ROUTES.EDIT_KEYWORD_SET)}
        component={EditKeywordSetPage}
      />
      <Route
        exact
        path={getLocalePath(ROUTES.KEYWORD_SETS)}
        component={KeywordSetsPage}
      />

      <Route
        exact
        path={getLocalePath(ROUTES.ORGANIZATIONS)}
        component={OrganizationsPage}
      />
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default AdminPageRoutes;
