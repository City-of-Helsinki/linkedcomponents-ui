/* eslint-disable max-len */
import { Button, ButtonVariant, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import useLocale from '../../hooks/useLocale';
import adminListPageStyles from '../admin/layout/adminListPage.module.scss';
import AdminListPageWrapper from '../admin/layout/adminListPageWrapper/AdminListPageWrapper';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { ORGANIZATION_ACTIONS } from '../organization/constants';
import OrganizationAuthenticationNotification from '../organization/organizationAuthenticationNotification/OrganizationAuthenticationNotification';
import useUser from '../user/hooks/useUser';
import OrganizationList from './organizationList/OrganizationList';

const OrganizationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();

  const goToCreateOrganizationPage = () => {
    navigate(`/${locale}${ROUTES.CREATE_ORGANIZATION}`);
  };

  return (
    <AdminListPageWrapper>
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('organizationsPage.title'), path: null },
            ]}
          />
        }
        button={
          <Button
            fullWidth={true}
            iconStart={<IconPlus aria-hidden={true} />}
            onClick={goToCreateOrganizationPage}
            variant={ButtonVariant.Primary}
          >
            {t('common.buttonAddOrganization')}
          </Button>
        }
        title={t('organizationsPage.title')}
      />

      <OrganizationAuthenticationNotification
        action={ORGANIZATION_ACTIONS.CREATE}
        className={adminListPageStyles.notification}
        id=""
      />

      <OrganizationList />
    </AdminListPageWrapper>
  );
};

const OrganizationsPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="organizationsPage.pageDescription"
      keywords={['keywords.organization', 'keywords.listing']}
      title="organizationsPage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <OrganizationsPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default OrganizationsPageWrapper;
