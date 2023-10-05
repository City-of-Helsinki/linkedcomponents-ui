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
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              {
                title: t('organizationsPage.title'),
                path: ROUTES.ORGANIZATIONS,
              },
              { title: t('createOrganizationPage.title'), path: null },
            ]}
          />
        }
        title={t('createOrganizationPage.title')}
      />

      <OrganizationForm />
    </div>
  );
};

const CreateOrganizationPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="createOrganizationPage.pageDescription"
      keywords={['keywords.add', 'keywords.new', 'keywords.organization']}
      title="createOrganizationPage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <CreateOrganizationPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreateOrganizationPageWrapper;
