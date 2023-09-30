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
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { KEYWORD_ACTIONS } from '../keyword/constants';
import KeywordAuthenticationNotification from '../keyword/keywordAuthenticationNotification/KeywordAuthenticationNotification';
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
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('keywordsPage.title'), path: null },
            ]}
          />
        }
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

      <KeywordAuthenticationNotification
        action={KEYWORD_ACTIONS.CREATE}
        className={styles.notification}
        publisher=""
      />

      <KeywordList />
    </div>
  );
};

const KeywordsPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="keywordsPage.pageDescription"
      keywords={['keywords.keyword', 'keywords.listing', 'keywords.browse']}
      title="keywordsPage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <KeywordsPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default KeywordsPageWrapper;
