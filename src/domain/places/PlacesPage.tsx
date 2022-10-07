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
import { PLACE_ACTIONS } from '../place/constants';
import PlaceAuthenticationNotification from '../place/placeAuthenticationNotification/PlaceAuthenticationNotification';
import useUser from '../user/hooks/useUser';
import PlaceList from './placeList/PlaceList';
import styles from './placesPage.module.scss';

const PlacesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();

  const goToCreatePlacePage = () => {
    navigate(`/${locale}${ROUTES.CREATE_PLACE}`);
  };

  return (
    <div className={styles.placesPage}>
      <TitleRow
        button={
          <Button
            fullWidth={true}
            iconLeft={<IconPlus aria-hidden={true} />}
            onClick={goToCreatePlacePage}
            variant="primary"
          >
            {t('common.buttonAddPlace')}
          </Button>
        }
        title={t('placesPage.title')}
      />
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>{t('placesPage.title')}</Breadcrumb.Item>
      </Breadcrumb>

      <PlaceAuthenticationNotification
        action={PLACE_ACTIONS.CREATE}
        className={styles.notification}
        publisher=""
      />

      <PlaceList />
    </div>
  );
};

const PlacesPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      description="placesPage.description"
      keywords={['keywords.place', 'keywords.listing']}
      title="placesPage.pageTitle"
    >
      <LoadingSpinner isLoading={loadingUser}>
        <PlacesPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default PlacesPageWrapper;
