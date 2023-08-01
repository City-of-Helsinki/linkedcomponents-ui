import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useField } from 'formik';
import { IconMinusCircle, IconPlusCircle } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import Fieldset from '../../../../common/components/fieldset/Fieldset';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import ImagePreview from '../../../../common/components/imagePreview/ImagePreview';
import { PAGE_SIZE } from '../../../../common/components/imageSelector/constants';
import Modal from '../../../../common/components/modal/Modal';
import Notification from '../../../../common/components/notification/Notification';
import { INPUT_MAX_WIDTHS } from '../../../../constants';
import {
  ImageFieldsFragment,
  useImageQuery,
} from '../../../../generated/graphql';
import getPathBuilder from '../../../../utils/getPathBuilder';
import getValue from '../../../../utils/getValue';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import { clearImagesQueries } from '../../../app/apollo/clearCacheUtils';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import AddImageForm from '../../../image/addImageForm/AddImageForm';
import useImageUpdateActions, {
  IMAGE_MODALS,
} from '../../../image/hooks/useImageUpdateActions';
import { AddImageSettings } from '../../../image/types';
import { imagePathBuilder } from '../../../image/utils';
import useUser from '../../../user/hooks/useUser';
import { EVENT_FIELDS } from '../../constants';
import eventPageStyles from '../../eventPage.module.scss';
import ImageDetailsFields from './imageDetailsFields/ImageDetailsFields';
import styles from './imageSection.module.scss';

interface Props {
  isEditingAllowed: boolean;
}

const ImageSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { loading: loadingUser, externalUser } = useUser();

  const { closeModal, openModal, setOpenModal, uploadImage } =
    useImageUpdateActions({});

  const isModalOpen = React.useMemo(
    () => openModal === IMAGE_MODALS.ADD_IMAGE,
    [openModal]
  );

  const openAddImageModal = () => {
    setOpenModal(IMAGE_MODALS.ADD_IMAGE);
  };

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: publisher }] = useField({ name: EVENT_FIELDS.PUBLISHER });
  const [{ value: images }, , { setValue: setImagesValue }] = useField({
    name: EVENT_FIELDS.IMAGES,
  });

  const imagePublisherValue = !loadingUser && externalUser ? '' : publisher;

  const imageAtId = images[0];
  const imageId = getValue(parseIdFromAtId(imageAtId), '');

  const { data: imageData } = useImageQuery({
    skip: !imageId,
    variables: {
      createPath: getPathBuilder(imagePathBuilder),
      id: imageId,
    },
  });

  const imageUrl = imageData?.image.url;

  const handleAddImageFormSubmit = (values: AddImageSettings) => {
    /* istanbul ignore else  */
    if (values.selectedImage.length) {
      setImagesValue(values.selectedImage);
      closeModal();
    } else if (values.url) {
      uploadImage(
        {
          publisher: imagePublisherValue,
          url: values.url,
        },
        setImageFields
      );
    }
  };

  const removeImage = () => {
    setImagesValue([]);
  };

  const setImageFields = (image: ImageFieldsFragment) => {
    setImagesValue([image.atId]);
  };

  React.useEffect(() => {
    if (!isModalOpen) {
      // Clear images queries to get fresh event list when opening modal again
      clearImagesQueries(apolloClient, { pageSize: PAGE_SIZE, publisher });
    }
  }, [apolloClient, isModalOpen, publisher]);

  return (
    <>
      {isModalOpen && (
        <Modal
          isOpen={openModal === IMAGE_MODALS.ADD_IMAGE}
          onClose={closeModal}
          shouldCloseOnEsc={false}
          title={t(`event.form.modalTitleImage.${type}`)}
        >
          <AddImageForm
            onCancel={closeModal}
            onAddImageByFile={(image) =>
              uploadImage(
                {
                  publisher: imagePublisherValue,
                  image,
                },
                setImageFields
              )
            }
            onSubmit={handleAddImageFormSubmit}
            publisher={publisher}
          />
        </Modal>
      )}

      <Fieldset heading={t('event.form.sections.image')} hideLegend>
        <h3>{t(`event.form.titleImage.${type}`)}</h3>
        <FieldRow
          notification={
            <Notification
              className={eventPageStyles.notificationForTitle}
              label={t(`event.form.notificationTitleImage.${type}`)}
              type="info"
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: t(`event.form.infoTextImage1.${type}`, {
                    openInNewTab: t('common.openInNewTab'),
                  }),
                }}
              />
              <p>{t(`event.form.infoTextImage2`)}</p>
              <p>{t(`event.form.infoTextImage3`)}</p>
              <p>{t(`event.form.infoTextImage4`)}</p>
            </Notification>
          }
        >
          <FieldColumn
            className={styles.imagePreviewWrapper}
            maxWidth={INPUT_MAX_WIDTHS.MEDIUM}
          >
            <FormGroup>
              <ImagePreview
                disabled={!isEditingAllowed}
                imageUrl={imageUrl}
                label={t(`event.form.buttonAddImage.${type}`)}
                onClick={openAddImageModal}
              />
            </FormGroup>

            <FormGroup>
              {!!images.length ? (
                <Button
                  disabled={!isEditingAllowed}
                  fullWidth={true}
                  iconLeft={<IconMinusCircle aria-hidden />}
                  onClick={removeImage}
                >
                  {t(`event.form.buttonRemoveImage.${type}`)}
                </Button>
              ) : (
                <Button
                  disabled={!isEditingAllowed}
                  fullWidth={true}
                  iconLeft={<IconPlusCircle aria-hidden />}
                  onClick={openAddImageModal}
                >
                  {t(`event.form.buttonAddImage.${type}`)}
                </Button>
              )}
            </FormGroup>

            <ImageDetailsFields
              field={EVENT_FIELDS.IMAGE_DETAILS}
              imageAtId={imageAtId}
            />
          </FieldColumn>
        </FieldRow>
      </Fieldset>
    </>
  );
};

export default ImageSection;
