import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import useUser from '../user/hooks/useUser';
import KeywordSetForm from './keywordSetForm/KeywordSetForm';

const CreateKeywordSetPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('keywordSetsPage.title'), path: ROUTES.KEYWORD_SETS },
              { title: t('createKeywordSetPage.title'), path: null },
            ]}
          />
        }
        title={t('createKeywordSetPage.title')}
      />

      <KeywordSetForm />
    </div>
  );
};

const CreateKeywordSetPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="createKeywordSetPage.pageDescription"
      keywords={[
        'keywords.add',
        'keywords.new',
        'keywords.keyword',
        'keywords.set',
      ]}
      title="createKeywordSetPage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <CreateKeywordSetPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreateKeywordSetPageWrapper;
