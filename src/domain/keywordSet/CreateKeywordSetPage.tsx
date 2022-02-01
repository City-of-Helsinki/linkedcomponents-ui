import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import PageWrapper from '../app/layout/PageWrapper';
import TitleRow from '../app/layout/TitleRow';
import useUser from '../user/hooks/useUser';
import KeywordSetForm from './keywordSetForm/KeywordSetForm';

const CreateKeywordPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <TitleRow title={t('createKeywordSetPage.title')} />
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.KEYWORD_SETS}>
          {t('keywordSetsPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>
          {t('createKeywordSetPage.title')}
        </Breadcrumb.Item>
      </Breadcrumb>
      <KeywordSetForm />
    </div>
  );
};

const CreateKeywordSetPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper title="createKeywordSetPage.pageTitle">
      <LoadingSpinner isLoading={loadingUser}>
        <CreateKeywordPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreateKeywordSetPageWrapper;
