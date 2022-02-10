import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import TitleRow from '../app/layout/TitleRow';
import NotSigned from '../notSigned/NotSigned';
import useUser from '../user/hooks/useUser';
import KeywordForm from './keywordForm/KeywordForm';

const CreateKeywordPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Container withOffset={true}>
        <TitleRow title={t('createKeywordPage.title')} />
        <Breadcrumb>
          <Breadcrumb.Item to="/">{t('common.home')}</Breadcrumb.Item>
          <Breadcrumb.Item to={ROUTES.KEYWORDS}>
            {t('keywordsPage.title')}
          </Breadcrumb.Item>
          <Breadcrumb.Item active={true}>
            {t('createKeywordPage.title')}
          </Breadcrumb.Item>
        </Breadcrumb>
      </Container>
      <KeywordForm />
    </div>
  );
};

const CreateKeywordPageWrapper: React.FC = () => {
  const { loading: loadingUser, user } = useUser();

  return (
    <PageWrapper title="createKeywordPage.pageTitle">
      <MainContent>
        <LoadingSpinner isLoading={loadingUser}>
          {user ? <CreateKeywordPage /> : <NotSigned />}
        </LoadingSpinner>
      </MainContent>
    </PageWrapper>
  );
};

export default CreateKeywordPageWrapper;
