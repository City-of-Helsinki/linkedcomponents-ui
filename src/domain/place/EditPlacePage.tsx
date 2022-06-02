import { Button } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import { PlaceFieldsFragment, usePlaceQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { authenticatedSelector } from '../auth/selectors';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import useUser from '../user/hooks/useUser';
import { PLACE_ACTIONS } from './constants';
import usePlaceUpdateActions, {
  PLACE_MODALS,
} from './hooks/usePlaceUpdateActions';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import PlaceForm from './placeForm/PlaceForm';
import { getEditButtonProps, getPlaceFields, placePathBuilder } from './utils';

type Props = {
  place: PlaceFieldsFragment;
};

const EditPlacePage: React.FC<Props> = ({ place }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();
  const { publisher } = getPlaceFields(place, locale);
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { closeModal, deletePlace, openModal, saving, setOpenModal } =
    usePlaceUpdateActions({
      place,
    });

  const goToPlacesPage = () => {
    navigate(`/${locale}${ROUTES.PLACES}`);
  };

  const onDelete = () => {
    deletePlace({
      onSuccess: () => goToPlacesPage(),
    });
  };

  const buttonProps = getEditButtonProps({
    action: PLACE_ACTIONS.DELETE,
    authenticated,
    onClick: () => setOpenModal(PLACE_MODALS.DELETE),
    organizationAncestors,
    publisher,
    t,
    user,
  });

  return (
    <div>
      <ConfirmDeleteModal
        isOpen={openModal === PLACE_MODALS.DELETE}
        isSaving={saving === PLACE_ACTIONS.DELETE}
        onClose={closeModal}
        onDelete={onDelete}
      />
      <TitleRow
        button={
          <Button
            {...buttonProps}
            fullWidth={true}
            iconLeft={buttonProps.icon}
            variant="danger"
          >
            {buttonProps.label}
          </Button>
        }
        title={t('editPlacePage.title')}
      />
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.PLACES}>
          {t('placesPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>
          {t('editPlacePage.title')}
        </Breadcrumb.Item>
      </Breadcrumb>
      <PlaceForm place={place} />
    </div>
  );
};

const EditPlacePageWrapper: React.FC = () => {
  const location = useLocation();
  const { loading: loadingUser } = useUser();
  const { id } = useParams<{ id: string }>();

  const { data: placeData, loading: loadingPlace } = usePlaceQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      createPath: getPathBuilder(placePathBuilder),
      id: id as string,
    },
  });

  const place = placeData?.place;
  const loading = loadingUser || loadingPlace;

  return (
    <PageWrapper title="editPlacePage.pageTitle">
      <LoadingSpinner isLoading={loading}>
        {place ? (
          <EditPlacePage place={place} />
        ) : (
          <NotFound
            pathAfterSignIn={`${location.pathname}${location.search}`}
          />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EditPlacePageWrapper;
