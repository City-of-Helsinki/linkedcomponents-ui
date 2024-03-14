/* eslint-disable max-len */
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import Button from '../../common/components/button/Button';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import useLocale from '../../hooks/useLocale';
import adminListPageStyles from '../admin/layout/adminListPage.module.scss';
import AdminListPageWrapper from '../admin/layout/adminListPageWrapper/AdminListPageWrapper';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { PRICE_GROUP_ACTIONS } from '../priceGroup/constants';
import PriceGroupAuthenticationNotification from '../priceGroup/priceGroupAuthenticationNotification/PriceGroupAuthenticationNotification';
import useUser from '../user/hooks/useUser';
import PriceGroupList from './priceGroupList/PriceGroupList';

const PriceGroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();

  const goToCreatePriceGroupPage = () => {
    navigate(`/${locale}${ROUTES.CREATE_PRICE_GROUP}`);
  };

  return (
    <AdminListPageWrapper>
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('priceGroupsPage.title'), path: null },
            ]}
          />
        }
        button={
          <Button
            fullWidth={true}
            iconLeft={<IconPlus aria-hidden={true} />}
            onClick={goToCreatePriceGroupPage}
            variant="primary"
          >
            {t('common.buttonAddPriceGroup')}
          </Button>
        }
        title={t('priceGroupsPage.title')}
      />

      <PriceGroupAuthenticationNotification
        action={PRICE_GROUP_ACTIONS.CREATE}
        className={adminListPageStyles.notification}
        publisher=""
      />

      <PriceGroupList />
    </AdminListPageWrapper>
  );
};

const PriceGroupPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="priceGroupsPage.pageDescription"
      keywords={['keywords.priceGroup', 'keywords.listing']}
      title="priceGroupsPage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <PriceGroupsPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default PriceGroupPageWrapper;
