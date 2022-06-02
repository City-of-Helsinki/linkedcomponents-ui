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
      <TitleRow title={t('createKeywordPage.title')} />
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.KEYWORDS}>
          {t('keywordsPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>
          {t('createKeywordPage.title')}
        </Breadcrumb.Item>
      </Breadcrumb>
      <KeywordForm />
    </div>
  );
};

const CreateKeywordPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper title="createKeywordPage.pageTitle">
      <LoadingSpinner isLoading={loadingUser}>
        <CreateKeywordPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreateKeywordPageWrapper;
