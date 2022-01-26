/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  KeywordFieldsFragment,
  useKeywordQuery,
} from '../../generated/graphql';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import TitleRow from '../app/layout/TitleRow';
import NotFound from '../notFound/NotFound';
import NotSignedPage from '../notSigned/NotSigned';
import useUser from '../user/hooks/useUser';
import KeywordForm from './keywordForm/KeywordForm';
import { keywordPathBuilder } from './utils';

type Props = {
  keyword: KeywordFieldsFragment;
};

const EditKeywordPage: React.FC<Props> = ({ keyword }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Container withOffset={true}>
        <TitleRow title={t('editKeywordPage.title')} />
        <Breadcrumb>
          <Breadcrumb.Item to="/">{t('common.home')}</Breadcrumb.Item>
          <Breadcrumb.Item to={ROUTES.KEYWORDS}>
            {t('keywordsPage.title')}
          </Breadcrumb.Item>
          <Breadcrumb.Item active={true}>
            {t('editKeywordPage.title')}
          </Breadcrumb.Item>
        </Breadcrumb>
      </Container>
      <KeywordForm keyword={keyword} />
    </div>
  );
};

const EditKeywordPageWrapper: React.FC = () => {
  const location = useLocation();
  const { loading: loadingUser, user } = useUser();
  const { id } = useParams<{ id: string }>();

  const { data: keywordData, loading: loadingKeyword } = useKeywordQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      createPath: getPathBuilder(keywordPathBuilder),
      id,
    },
  });

  const keyword = keywordData?.keyword;

  const loading = loadingUser || loadingKeyword;

  return (
    <PageWrapper title="editKeywordPage.pageTitle">
      <MainContent>
        <LoadingSpinner isLoading={loading}>
          {user ? (
            <>
              {keyword ? (
                <EditKeywordPage keyword={keyword} />
              ) : (
                <NotFound
                  pathAfterSignIn={`${location.pathname}${location.search}`}
                />
              )}
            </>
          ) : (
            <NotSignedPage />
          )}
        </LoadingSpinner>
      </MainContent>
    </PageWrapper>
  );
};

export default EditKeywordPageWrapper;
