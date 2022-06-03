import React from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import NotFoundPage from '../../../notFound/NotFound';

const CreateImagePage = React.lazy(
  () => import('../../../image/CreateImagePage')
);
const CreateKeywordPage = React.lazy(
  () => import('../../../keyword/CreateKeywordPage')
);
const CreateKeywordSetPage = React.lazy(
  () => import('../../../keywordSet/CreateKeywordSetPage')
);
const CreateOrganizationPage = React.lazy(
  () => import('../../../organization/CreateOrganizationPage')
);
const CreatePlacePage = React.lazy(
  () => import('../../../place/CreatePlacePage')
);
const EditImagePage = React.lazy(() => import('../../../image/EditImagePage'));
const EditKeywordPage = React.lazy(
  () => import('../../../keyword/EditKeywordPage')
);
const EditKeywordSetPage = React.lazy(
  () => import('../../../keywordSet/EditKeywordSetPage')
);
const EditOrganizationPage = React.lazy(
  () => import('../../../organization/EditOrganizationPage')
);
const EditPlacePage = React.lazy(() => import('../../../place/EditPlacePage'));
const ImagesPage = React.lazy(() => import('../../../images/ImagesPage'));
const KeywordsPage = React.lazy(() => import('../../../keywords/KeywordsPage'));
const KeywordSetsPage = React.lazy(
  () => import('../../../keywordSets/KeywordSetsPage')
);
const OrganizationsPage = React.lazy(
  () => import('../../../organizations/OrganizationsPage')
);
const PlacesPage = React.lazy(() => import('../../../places/PlacesPage'));

const AdminPageRoutes: React.FC = () => {
  const locale = useLocale();
  const getAdminRoutePath = (path: string) => path.replace(ROUTES.ADMIN, '');
  const getLocalePath = (path: string) => `/${locale}${path}`;

  return (
    <Routes>
      <Route
        path={getAdminRoutePath(ROUTES.ADMIN)}
        element={<Navigate replace to={getLocalePath(ROUTES.KEYWORDS)} />}
      />

      <Route
        path={getAdminRoutePath(ROUTES.CREATE_IMAGE)}
        element={<CreateImagePage />}
      />
      <Route
        path={getAdminRoutePath(ROUTES.EDIT_IMAGE)}
        element={<EditImagePage />}
      />
      <Route path={getAdminRoutePath(ROUTES.IMAGES)} element={<ImagesPage />} />

      <Route
        path={getAdminRoutePath(ROUTES.CREATE_KEYWORD)}
        element={<CreateKeywordPage />}
      />
      <Route
        path={getAdminRoutePath(ROUTES.EDIT_KEYWORD)}
        element={<EditKeywordPage />}
      />
      <Route
        path={getAdminRoutePath(ROUTES.KEYWORDS)}
        element={<KeywordsPage />}
      />

      <Route
        path={getAdminRoutePath(ROUTES.CREATE_KEYWORD_SET)}
        element={<CreateKeywordSetPage />}
      />
      <Route
        path={getAdminRoutePath(ROUTES.EDIT_KEYWORD_SET)}
        element={<EditKeywordSetPage />}
      />
      <Route
        path={getAdminRoutePath(ROUTES.KEYWORD_SETS)}
        element={<KeywordSetsPage />}
      />

      <Route
        path={getAdminRoutePath(ROUTES.CREATE_ORGANIZATION)}
        element={<CreateOrganizationPage />}
      />
      <Route
        path={getAdminRoutePath(ROUTES.EDIT_ORGANIZATION)}
        element={<EditOrganizationPage />}
      />
      <Route
        path={getAdminRoutePath(ROUTES.ORGANIZATIONS)}
        element={<OrganizationsPage />}
      />

      <Route
        path={getAdminRoutePath(ROUTES.CREATE_PLACE)}
        element={<CreatePlacePage />}
      />
      <Route
        path={getAdminRoutePath(ROUTES.EDIT_PLACE)}
        element={<EditPlacePage />}
      />
      <Route path={getAdminRoutePath(ROUTES.PLACES)} element={<PlacesPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminPageRoutes;
