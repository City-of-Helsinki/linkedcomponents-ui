import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import Button from '../../common/components/button/Button';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import useLocale from '../../hooks/useLocale';
import PageWrapper from '../app/layout/PageWrapper';
import TitleRow from '../app/layout/TitleRow';
import useUser from '../user/hooks/useUser';
import KeywordList from './keywordList/KeywordList';
import styles from './keywordsPage.module.scss';

const KeywordsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();

  const goToCreateKeywordPage = () => {
    navigate(`/${locale}${ROUTES.CREATE_KEYWORD}`);
  };

  return (
    <div className={styles.keywordsPage}>
      <TitleRow
        button={
          <Button
            fullWidth={true}
            iconLeft={<IconPlus aria-hidden={true} />}
            onClick={goToCreateKeywordPage}
            variant="primary"
          >
            {t('common.buttonAddKeyword')}
          </Button>
        }
        title={t('keywordsPage.title')}
      />
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>
          {t('keywordsPage.title')}
        </Breadcrumb.Item>
      </Breadcrumb>
      <KeywordList />
    </div>
  );
};

const KeywordsPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper title="keywordsPage.pageTitle">
      <LoadingSpinner isLoading={loadingUser}>
        <KeywordsPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default KeywordsPageWrapper;
