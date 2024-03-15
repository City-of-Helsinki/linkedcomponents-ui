import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import Button from '../../common/components/button/Button';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import useLocale from '../../hooks/useLocale';
import adminListPageStyles from '../admin/layout/adminListPage.module.scss';
import AdminListPageWrapper from '../admin/layout/adminListPageWrapper/AdminListPageWrapper';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { PLACE_ACTIONS } from '../place/constants';
import PlaceAuthenticationNotification from '../place/placeAuthenticationNotification/PlaceAuthenticationNotification';
import useUser from '../user/hooks/useUser';
import PlaceList from './placeList/PlaceList';

const PlacesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();

  const goToCreatePlacePage = () => {
    navigate(`/${locale}${ROUTES.CREATE_PLACE}`);
  };

  return (
    <AdminListPageWrapper>
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('placesPage.title'), path: null },
            ]}
          />
        }
        button={
          <Button
            fullWidth={true}
            iconLeft={<IconPlus aria-hidden={true} />}
            onClick={goToCreatePlacePage}
            variant="primary"
          >
            {t('common.buttonAddPlace')}
          </Button>
        }
        title={t('placesPage.title')}
      />

      <PlaceAuthenticationNotification
        action={PLACE_ACTIONS.CREATE}
        className={adminListPageStyles.notification}
        publisher=""
      />

      <PlaceList />
    </AdminListPageWrapper>
  );
};

const PlacesPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="placesPage.pageDescription"
      keywords={['keywords.place', 'keywords.listing']}
      title="placesPage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <PlacesPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default PlacesPageWrapper;
