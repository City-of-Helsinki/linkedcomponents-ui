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
import { KEYWORD_SET_ACTIONS } from '../keywordSet/constants';
import KeywordSetAuthenticationNotification from '../keywordSet/keywordSetAuthenticationNotification/KeywordSetAuthenticationNotification';
import useUser from '../user/hooks/useUser';
import KeywordSetList from './keywordSetList/KeywordSetList';

const KeywordsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();

  const goToCreateKeywordSetPage = () => {
    navigate(`/${locale}${ROUTES.CREATE_KEYWORD_SET}`);
  };

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
        button={
          <Button
            fullWidth={true}
            iconLeft={<IconPlus aria-hidden={true} />}
            onClick={goToCreateKeywordSetPage}
            variant="primary"
          >
            {t('common.buttonAddKeywordSet')}
          </Button>
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
