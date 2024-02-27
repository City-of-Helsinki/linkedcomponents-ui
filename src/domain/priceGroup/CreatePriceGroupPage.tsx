import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import useUser from '../user/hooks/useUser';
import PriceGroupForm from './priceGroupForm/PriceGroupForm';

const CreatePlacePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('placesPage.title'), path: ROUTES.PLACES },
              { title: t('createPriceGroupPage.title'), path: null },
            ]}
          />
        }
        title={t('createPlacePage.title')}
      />

      <PriceGroupForm />
    </div>
  );
};

const CreatePriceGroupPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="createPriceGroupPage.pageDescription"
      keywords={['keywords.add', 'keywords.new', 'keywords.priceGroup']}
      title="createPriceGroupPage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <CreatePlacePage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreatePriceGroupPageWrapper;
