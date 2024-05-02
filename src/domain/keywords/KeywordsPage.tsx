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
import { KEYWORD_ACTIONS } from '../keyword/constants';
import KeywordAuthenticationNotification from '../keyword/keywordAuthenticationNotification/KeywordAuthenticationNotification';
import useUser from '../user/hooks/useUser';
import KeywordList from './keywordList/KeywordList';

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
              { title: t('keywordsPage.title'), path: null },
            ]}
          />
        }
        title={t('keywordsPage.title')}
      />

      <KeywordAuthenticationNotification
        action={KEYWORD_ACTIONS.CREATE}
        className={adminListPageStyles.notification}
        publisher=""
      />

      <KeywordList />
    </AdminListPageWrapper>
  );
};

const KeywordsPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="keywordsPage.pageDescription"
      keywords={['keywords.keyword', 'keywords.listing', 'keywords.browse']}
      title="keywordsPage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <KeywordsPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default KeywordsPageWrapper;
