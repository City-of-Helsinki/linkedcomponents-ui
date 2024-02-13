import { Button } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import { PlaceFieldsFragment, usePlaceQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { useNotificationsContext } from '../app/notificationsContext/hooks/useNotificationsContext';
import useAuth from '../auth/hooks/useAuth';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import useUser from '../user/hooks/useUser';
import { PLACE_ACTIONS } from './constants';
import usePlaceUpdateActions, { PLACE_MODALS } from './hooks/usePlaceActions';
import ConfirmDeletePlaceModal from './modals/confirmDeletePlaceModal/ConfirmDeletePlaceModal';
import PlaceForm from './placeForm/PlaceForm';
import { getEditButtonProps, getPlaceFields, placePathBuilder } from './utils';

type Props = {
  place: PlaceFieldsFragment;
};

const EditPlacePage: React.FC<Props> = ({ place }) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const navigate = useNavigate();
  const locale = useLocale();
  const { publisher } = getPlaceFields(place, locale);
  const { authenticated } = useAuth();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { closeModal, deletePlace, openModal, saving, setOpenModal } =
    usePlaceUpdateActions({
      place,
    });

  const goToPlacesPage = () => {
    navigate(`/${locale}${ROUTES.PLACES}`);
  };

  const handleDelete = () => {
    deletePlace({
      onSuccess: () => {
        goToPlacesPage();
        addNotification({
          label: t('place.form.notificationPlaceDeleted'),
          type: 'success',
        });
      },
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
      <ConfirmDeletePlaceModal
        isOpen={openModal === PLACE_MODALS.DELETE}
        isSaving={saving === PLACE_ACTIONS.DELETE}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('placesPage.title'), path: ROUTES.PLACES },
              { title: t('editPlacePage.title'), path: null },
            ]}
          />
        }
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

      <PlaceForm place={place} />
    </div>
  );
};

const EditPlacePageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();
  const { id } = useParams<{ id: string }>();

  const { data: placeData, loading: loadingPlace } = usePlaceQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      createPath: getPathBuilder(placePathBuilder),
      id: getValue(id, ''),
    },
  });

  const place = placeData?.place;
  const loading = loadingUser || loadingPlace;

  return (
    <PageWrapper title="editPlacePage.pageTitle">
      <LoadingSpinner isLoading={loading}>
        {place ? <EditPlacePage place={place} /> : <NotFound />}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EditPlacePageWrapper;
