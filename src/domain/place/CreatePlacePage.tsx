import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import useUser from '../user/hooks/useUser';
import PlaceForm from './placeForm/PlaceForm';

const CreatePlacePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <TitleRow title={t('createPlacePage.title')} />
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.PLACES}>
          {t('placesPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>
          {t('createPlacePage.title')}
        </Breadcrumb.Item>
      </Breadcrumb>
      <PlaceForm />
    </div>
  );
};

const CreatePlacePageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper title="createPlacePage.pageTitle">
      <LoadingSpinner isLoading={loadingUser}>
        <CreatePlacePage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreatePlacePageWrapper;
