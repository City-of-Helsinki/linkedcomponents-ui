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
import { IMAGE_ACTIONS } from '../image/constants';
import ImageAuthenticationNotification from '../image/imageAuthenticationNotification/ImageAuthenticationNotification';
import useUser from '../user/hooks/useUser';
import ImageList from './imageList/ImageList';
import styles from './imagesPage.module.scss';

const KeywordsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();

  const goToCreateImagePage = () => {
    navigate(`/${locale}${ROUTES.CREATE_IMAGE}`);
  };

  return (
    <div className={styles.imagesPage}>
      <TitleRow
        breadcrumb={
          <Breadcrumb
            items={[
              { label: t('common.home'), to: ROUTES.HOME },
              { label: t('adminPage.title'), to: ROUTES.ADMIN },
              { active: true, label: t('imagesPage.title') },
            ]}
          />
        }
        button={
          <Button
            fullWidth={true}
            iconLeft={<IconPlus aria-hidden={true} />}
            onClick={goToCreateImagePage}
            variant="primary"
          >
            {t('common.buttonAddImage')}
          </Button>
        }
        title={t('imagesPage.title')}
      />

      <ImageAuthenticationNotification
        action={IMAGE_ACTIONS.CREATE}
        className={styles.notification}
        publisher=""
      />

      <ImageList />
    </div>
  );
};

const ImagesPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="imagesPage.pageDescription"
      keywords={['keywords.image', 'keywords.listing', 'keywords.browse']}
      title="imagesPage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <KeywordsPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default ImagesPageWrapper;
