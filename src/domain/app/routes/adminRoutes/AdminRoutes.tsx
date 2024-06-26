import React from 'react';
import { Navigate, Route, Routes } from 'react-router';

import LoadingSpinner from '../../../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { featureFlagUtils } from '../../../../utils/featureFlags';
import AdminPageLayout from '../../../admin/layout/AdminPageLayout';
import NotFoundPage from '../../../notFound/NotFound';
import useUser from '../../../user/hooks/useUser';
import {
  areAdminRoutesAllowed,
  areFinancialRoutesAllowed,
} from '../../../user/permissions';

const CreateImagePage = React.lazy(
  () => import('../../../image/CreateImagePage')
);
const CreateOrganizationPage = React.lazy(
  () => import('../../../organization/CreateOrganizationPage')
);
const CreatePlacePage = React.lazy(
  () => import('../../../place/CreatePlacePage')
);
const CreatePriceGroupPage = React.lazy(
  () => import('../../../priceGroup/CreatePriceGroupPage')
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
const EditPriceGroupPage = React.lazy(
  () => import('../../../priceGroup/EditPriceGroupPage')
);
const ImagesPage = React.lazy(() => import('../../../images/ImagesPage'));
const KeywordsPage = React.lazy(() => import('../../../keywords/KeywordsPage'));
const KeywordSetsPage = React.lazy(
  () => import('../../../keywordSets/KeywordSetsPage')
);
const OrganizationsPage = React.lazy(
  () => import('../../../organizations/OrganizationsPage')
);
const PlacesPage = React.lazy(() => import('../../../places/PlacesPage'));
const PriceGroupsPage = React.lazy(
  () => import('../../../priceGroups/PriceGroupsPage')
);

const AdminPageRoutes: React.FC = () => {
  const locale = useLocale();
  const { loading, user } = useUser();
  const getAdminRoutePath = (path: string) => path.replace(ROUTES.ADMIN, '');
  const getLocalePath = (path: string) => `/${locale}${path}`;

  return (
    <LoadingSpinner isLoading={loading}>
      {areAdminRoutesAllowed(user) ? (
        <AdminPageLayout>
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
            <Route
              path={getAdminRoutePath(ROUTES.IMAGES)}
              element={<ImagesPage />}
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
              path={getAdminRoutePath(ROUTES.EDIT_KEYWORD_SET)}
              element={<EditKeywordSetPage />}
            />
            <Route
              path={getAdminRoutePath(ROUTES.KEYWORD_SETS)}
              element={<KeywordSetsPage />}
            />

            {areFinancialRoutesAllowed(user) && (
              <>
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
              </>
            )}
            {featureFlagUtils.isFeatureEnabled('SHOW_PLACE_PAGES') && (
              <>
                <Route
                  path={getAdminRoutePath(ROUTES.CREATE_PLACE)}
                  element={<CreatePlacePage />}
                />
                <Route
                  path={getAdminRoutePath(ROUTES.EDIT_PLACE)}
                  element={<EditPlacePage />}
                />
                <Route
                  path={getAdminRoutePath(ROUTES.PLACES)}
                  element={<PlacesPage />}
                />
              </>
            )}

            {areFinancialRoutesAllowed(user) && (
              <>
                <Route
                  path={getAdminRoutePath(ROUTES.CREATE_PRICE_GROUP)}
                  element={<CreatePriceGroupPage />}
                />
                <Route
                  path={getAdminRoutePath(ROUTES.EDIT_PRICE_GROUP)}
                  element={<EditPriceGroupPage />}
                />
                <Route
                  path={getAdminRoutePath(ROUTES.PRICE_GROUPS)}
                  element={<PriceGroupsPage />}
                />
              </>
            )}

            <Route
              path="*"
              element={
                <NotFoundPage pathAfterSignIn={`/${locale}${ROUTES.HOME}`} />
              }
            />
          </Routes>
        </AdminPageLayout>
      ) : (
        <NotFoundPage />
      )}
    </LoadingSpinner>
  );
};

export default AdminPageRoutes;
