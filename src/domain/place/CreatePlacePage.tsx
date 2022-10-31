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
      <TitleRow
        breadcrumb={
          <Breadcrumb
            items={[
              { label: t('common.home'), to: ROUTES.HOME },
              { label: t('adminPage.title'), to: ROUTES.ADMIN },
              { label: t('placesPage.title'), to: ROUTES.PLACES },
              { active: true, label: t('createPlacePage.title') },
            ]}
          />
        }
        title={t('createPlacePage.title')}
      />

      <PlaceForm />
    </div>
  );
};

const CreatePlacePageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="createPlacePage.pageDescription"
      keywords={['keywords.add', 'keywords.new', 'keywords.place']}
      title="createPlacePage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <CreatePlacePage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreatePlacePageWrapper;
