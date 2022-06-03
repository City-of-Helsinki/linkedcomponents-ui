/* eslint-disable max-len */
import { Button, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import useLocale from '../../hooks/useLocale';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { ORGANIZATION_ACTIONS } from '../organization/constants';
import OrganizationAuthenticationNotification from '../organization/organizationAuthenticationNotification/OrganizationAuthenticationNotification';
import useUser from '../user/hooks/useUser';
import OrganizationList from './organizationList/OrganizationList';
import styles from './organizations.module.scss';

const OrganizationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();

  const goToCreateOrganizationPage = () => {
    navigate(`/${locale}${ROUTES.CREATE_ORGANIZATION}`);
  };

  return (
    <div className={styles.organizationsPage}>
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

      <OrganizationAuthenticationNotification
        action={ORGANIZATION_ACTIONS.CREATE}
        className={styles.notification}
        id=""
      />

      <OrganizationList />
    </div>
  );
};

const OrganizationsPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper title="organizationsPage.pageTitle">
      <LoadingSpinner isLoading={loadingUser}>
        <OrganizationsPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default OrganizationsPageWrapper;
