import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import useUser from '../user/hooks/useUser';
import ImageForm from './imageForm/ImageForm';

const CreateImagePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('imagesPage.title'), path: ROUTES.IMAGES },
              { title: t('createImagePage.title'), path: null },
            ]}
          />
        }
        title={t('createImagePage.title')}
      />

      <ImageForm />
    </div>
  );
};

const CreateImagePageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="createImagePage.pageDescription"
      keywords={[
        'keywords.add',
        'keywords.new',
        'keywords.image',
        'keywords.edit',
        'keywords.upload',
      ]}
      title="createImagePage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <CreateImagePage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreateImagePageWrapper;
