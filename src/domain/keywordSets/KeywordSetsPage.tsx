/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import adminListPageStyles from '../admin/layout/adminListPage.module.scss';
import AdminListPageWrapper from '../admin/layout/adminListPageWrapper/AdminListPageWrapper';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { KEYWORD_SET_ACTIONS } from '../keywordSet/constants';
import KeywordSetAuthenticationNotification from '../keywordSet/keywordSetAuthenticationNotification/KeywordSetAuthenticationNotification';
import useUser from '../user/hooks/useUser';
import KeywordSetList from './keywordSetList/KeywordSetList';

const KeywordsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AdminListPageWrapper>
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('keywordSetsPage.title'), path: null },
            ]}
          />
        }
        title={t('keywordSetsPage.title')}
      />

      <KeywordSetAuthenticationNotification
        action={KEYWORD_SET_ACTIONS.CREATE}
        className={adminListPageStyles.notification}
        organization=""
      />

      <KeywordSetList />
    </AdminListPageWrapper>
  );
};

const KeywordSetsPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="keywordSetsPage.pageDescription"
      keywords={['keywords.keyword', 'keywords.set', 'keywords.listing']}
      title="keywordSetsPage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <KeywordsPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default KeywordSetsPageWrapper;
