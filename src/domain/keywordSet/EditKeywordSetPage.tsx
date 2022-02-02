/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  KeywordSetFieldsFragment,
  useKeywordSetQuery,
} from '../../generated/graphql';
import getPathBuilder from '../../utils/getPathBuilder';
import PageWrapper from '../app/layout/PageWrapper';
import TitleRow from '../app/layout/TitleRow';
import NotFound from '../notFound/NotFound';
import useUser from '../user/hooks/useUser';
import KeywordSetForm from './keywordSetForm/KeywordSetForm';
import { keywordSetPathBuilder } from './utils';

type Props = {
  keywordSet: KeywordSetFieldsFragment;
};

const EditKeywordSetPage: React.FC<Props> = ({ keywordSet }) => {
  const { t } = useTranslation();

  return (
    <div>
      <TitleRow title={t('editKeywordSetPage.title')} />
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.KEYWORDS}>
          {t('keywordSetsPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>
          {t('editKeywordSetPage.title')}
        </Breadcrumb.Item>
      </Breadcrumb>
      <KeywordSetForm keywordSet={keywordSet} />
    </div>
  );
};

const EditKeywordSetPageWrapper: React.FC = () => {
  const location = useLocation();
  const { loading: loadingUser } = useUser();
  const { id } = useParams<{ id: string }>();

  const { data: keywordSetData, loading: loadingKeywordSet } =
    useKeywordSetQuery({
      fetchPolicy: 'no-cache',
      variables: {
        createPath: getPathBuilder(keywordSetPathBuilder),
        id,
      },
    });

  const keywordSet = keywordSetData?.keywordSet;

  const loading = loadingUser || loadingKeywordSet;

  return (
    <PageWrapper title="editKeywordSetPage.pageTitle">
      <LoadingSpinner isLoading={loading}>
        {keywordSet ? (
          <EditKeywordSetPage keywordSet={keywordSet} />
        ) : (
          <NotFound
            pathAfterSignIn={`${location.pathname}${location.search}`}
          />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EditKeywordSetPageWrapper;
