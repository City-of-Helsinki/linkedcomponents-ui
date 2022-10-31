import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import useUser from '../user/hooks/useUser';
import KeywordForm from './keywordForm/KeywordForm';

const CreateKeywordPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <TitleRow
        breadcrumb={
          <Breadcrumb
            items={[
              { label: t('common.home'), to: ROUTES.HOME },
              { label: t('adminPage.title'), to: ROUTES.ADMIN },
              { label: t('keywordsPage.title'), to: ROUTES.KEYWORDS },
              { active: true, label: t('createKeywordPage.title') },
            ]}
          />
        }
        title={t('createKeywordPage.title')}
      />

      <KeywordForm />
    </div>
  );
};

const CreateKeywordPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="createKeywordPage.pageDescription"
      keywords={['keywords.add', 'keywords.new', 'keywords.keyword']}
      title="createKeywordPage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <CreateKeywordPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreateKeywordPageWrapper;
