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
      <TitleRow title={t('createImagePage.title')} />
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.IMAGES}>
          {t('imagesPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>
          {t('createImagePage.title')}
        </Breadcrumb.Item>
      </Breadcrumb>
      <ImageForm />
    </div>
  );
};

const CreateImagePageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="createImagePage.description"
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
