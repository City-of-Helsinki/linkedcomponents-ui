import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import useUser from '../user/hooks/useUser';
import OrganizationForm from './organizationForm/OrganizationForm';

const CreateOrganizationPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <TitleRow title={t('createOrganizationPage.title')} />
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ORGANIZATIONS}>
          {t('organizationsPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>
          {t('createOrganizationPage.title')}
        </Breadcrumb.Item>
      </Breadcrumb>
      <OrganizationForm />
    </div>
  );
};

const CreateOrganizationPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper title="createOrganizationPage.pageTitle">
      <LoadingSpinner isLoading={loadingUser}>
        <CreateOrganizationPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreateOrganizationPageWrapper;
