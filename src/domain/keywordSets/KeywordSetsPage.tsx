import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import Button from '../../common/components/button/Button';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import useLocale from '../../hooks/useLocale';
import PageWrapper from '../app/layout/PageWrapper';
import TitleRow from '../app/layout/TitleRow';
import useUser from '../user/hooks/useUser';
import KeywordSetList from './keywordSetList/KeywordSetList';
import styles from './keywordSetsPage.module.scss';

const KeywordsPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const locale = useLocale();

  const goToCreateKeywordSetPage = () => {
    history.push(`/${locale}${ROUTES.CREATE_KEYWORD_SET}`);
  };

  return (
    <div className={styles.keywordSetsPage}>
      <TitleRow
        button={
          <Button
            className={styles.addButton}
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
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>
          {t('keywordSetsPage.title')}
        </Breadcrumb.Item>
      </Breadcrumb>
      <KeywordSetList />
    </div>
  );
};

const KeywordSetsPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper title="keywordSetsPage.pageTitle">
      <LoadingSpinner isLoading={loadingUser}>
        <KeywordsPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default KeywordSetsPageWrapper;
