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
import PageWrapper from '../app/layout/PageWrapper';
import TitleRow from '../app/layout/TitleRow';
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
    navigate(`/${locale}${ROUTES.CREATE_KEYWORD}`);
  };

  return (
    <div className={styles.imagesPage}>
      <TitleRow
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
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>{t('imagesPage.title')}</Breadcrumb.Item>
      </Breadcrumb>

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
    <PageWrapper title="imagesPage.pageTitle">
      <LoadingSpinner isLoading={loadingUser}>
        <KeywordsPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default ImagesPageWrapper;
