import { ButtonVariant } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import Button from '../../common/components/button/Button';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import { ImageFieldsFragment, useImageQuery } from '../../generated/graphql';
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
import { IMAGE_ACTIONS } from './constants';
import useImageUpdateActions, {
  IMAGE_MODALS,
} from './hooks/useImageUpdateActions';
import ImageForm from './imageForm/ImageForm';
import ConfirmDeleteImageModal from './modals/confirmDeleteImageModal/ConfirmDeleteImageModal';
import { getEditButtonProps, getImageFields, imagePathBuilder } from './utils';

type Props = {
  image: ImageFieldsFragment;
};

const EditImagePage: React.FC<Props> = ({ image }) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const navigate = useNavigate();
  const { publisher } = getImageFields(image, locale);
  const { authenticated } = useAuth();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { closeModal, deleteImage, openModal, saving, setOpenModal } =
    useImageUpdateActions({
      image,
    });

  const goToImagesPage = () => {
    navigate(`/${locale}${ROUTES.IMAGES}`);
  };

  const handleDelete = () => {
    deleteImage({
      onSuccess: () => {
        goToImagesPage();
        addNotification({
          label: t('image.form.notificationImageDeleted'),
          type: 'success',
        });
      },
    });
  };

  const buttonProps = getEditButtonProps({
    action: IMAGE_ACTIONS.DELETE,
    authenticated,
    onClick: () => setOpenModal(IMAGE_MODALS.DELETE),
    organizationAncestors,
    publisher,
    t,
    user,
  });

  return (
    <div>
      <ConfirmDeleteImageModal
        isOpen={openModal === IMAGE_MODALS.DELETE}
        isSaving={saving === IMAGE_ACTIONS.DELETE}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('imagesPage.title'), path: ROUTES.IMAGES },
              { title: t('editImagePage.title'), path: null },
            ]}
          />
        }
        button={
          <Button
            {...buttonProps}
            fullWidth={true}
            iconStart={buttonProps.icon}
            variant={ButtonVariant.Danger}
          >
            {buttonProps.label}
          </Button>
        }
        title={t('editImagePage.title')}
      />

      <ImageForm image={image} />
    </div>
  );
};

const EditImagePageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();
  const { id } = useParams<{ id: string }>();

  const { data: imageData, loading: loadingImage } = useImageQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      createPath: getPathBuilder(imagePathBuilder),
      id: getValue(id, ''),
    },
  });

  const image = imageData?.image;

  const loading = loadingUser || loadingImage;

  return (
    <PageWrapper title="editImagePage.pageTitle">
      <LoadingSpinner isLoading={loading}>
        {image ? <EditImagePage image={image} /> : <NotFound />}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EditImagePageWrapper;
