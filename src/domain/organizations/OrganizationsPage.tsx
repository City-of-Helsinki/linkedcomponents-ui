import { Button, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import useLocale from '../../hooks/useLocale';
import PageWrapper from '../app/layout/PageWrapper';
import TitleRow from '../app/layout/TitleRow';
import useUser from '../user/hooks/useUser';
import OrganizationList from './organizationList/OrganizationList';

const OrganizationsPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const locale = useLocale();

  const goToCreateOrganizationPage = () => {
    history.push(`/${locale}${ROUTES.CREATE_ORGANIZATION}`);
  };

  return (
    <div>
      <TitleRow
        button={
          <Button
            fullWidth={true}
            iconLeft={<IconPlus aria-hidden={true} />}
            onClick={goToCreateOrganizationPage}
            variant="primary"
          >
            {t('common.buttonAddOrganization')}
          </Button>
        }
        title={t('organizationsPage.title')}
      />
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>
          {t('organizationsPage.title')}
        </Breadcrumb.Item>
      </Breadcrumb>
      <OrganizationList />
    </div>
  );
};

const OrganizationsPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper title="keywordsPage.pageTitle">
      <LoadingSpinner isLoading={loadingUser}>
        <OrganizationsPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default OrganizationsPageWrapper;
