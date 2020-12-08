import { useField } from 'formik';
import { IconMinusCircle, IconPlusCircle } from 'hds-react/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Button from '../../../../common/components/button/Button';
import ImagePreview from '../../../../common/components/imagePreview/ImagePreview';
import { PAGE_SIZE as IMAGES_PAGE_SIZE } from '../../../../common/components/imageSelector/constants';
import InputRow from '../../../../common/components/inputRow/InputRow';
import Modal from '../../../../common/components/modal/Modal';
import Notification from '../../../../common/components/notification/Notification';
import { INPUT_MAX_WIDTHS } from '../../../../constants';
import {
  useImageQuery,
  useImagesQuery,
  useUploadImageMutation,
} from '../../../../generated/graphql';
import getPathBuilder from '../../../../utils/getPathBuilder';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import { imagePathBuilder, imagesPathBuilder } from '../../../image/utils';
import { EVENT_FIELDS } from '../../constants';
import { AddImageSettings } from '../../types';
import InputWrapper from '../InputWrapper';
import AddImageForm from './addImageForm/AddImageForm';
import ImageDetailsFields from './imageDetailsFields/ImageDetailsFields';
import styles from './imageSection.module.scss';

const ImageSection = () => {
  const { t } = useTranslation();

  const [isModalOpen, setIsmodalOpen] = React.useState(false);
  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });

  const [uploadImageMutation] = useUploadImageMutation();
  const [{ value: images }, , { setValue: setImagesValue }] = useField({
    name: EVENT_FIELDS.IMAGES,
  });

  const { refetch: refetchImages } = useImagesQuery({
    skip: true,
    variables: {
      createPath: getPathBuilder(imagesPathBuilder),
      pageSize: IMAGES_PAGE_SIZE,
    },
  });

  const imageAtId = images[0];

  const { data: imagesData } = useImageQuery({
    skip: !imageAtId,
    variables: {
      createPath: getPathBuilder(imagePathBuilder),
      id: parseIdFromAtId(imageAtId) as string,
    },
  });

  const imageUrl = imagesData?.image.url;

  const openModal = () => {
    setIsmodalOpen(true);
  };

  const closeModal = () => {
    setIsmodalOpen(false);
  };

  const handleAddImageFormSubmit = (values: AddImageSettings) => {
    /* istanbul ignore else  */
    if (values.selectedImage.length) {
      setImagesValue(values.selectedImage);
      closeModal();
    } else if (values.url) {
      uploadImage({ url: values.url });
    }
  };

  const removeImage = () => {
    setImagesValue([]);
  };

  const uploadImage = async ({
    image,
    url,
  }: {
    image?: File;
    url?: string;
  }) => {
    try {
      const data = await uploadImageMutation({
        variables: {
          input: { image, name: '', url },
        },
      });

      setImagesValue([data.data?.uploadImage.atId]);
      closeModal();
      // Update images for image selector to show new image as a first item
      refetchImages();
    } catch (e) {
      /* istanbul ignore next  */
      toast.error(t('image.uploadError'));
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        shouldCloseOnEsc={false}
        title={t(`event.form.modalTitleImage`)}
      >
        <AddImageForm
          onCancel={closeModal}
          onFileChange={(image: File) => {
            uploadImage({ image });
          }}
          onSubmit={handleAddImageFormSubmit}
        />
      </Modal>
      <h3>{t(`event.form.titleImage.${type}`)}</h3>
      <InputRow
        info={
          <Notification
            label={t(`event.form.notificationTitleImage.${type}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextImage1.${type}`)}</p>
            <p>{t(`event.form.infoTextImage2`)}</p>
            <p>{t(`event.form.infoTextImage3`)}</p>
          </Notification>
        }
        infoWidth={5}
      >
        <InputWrapper
          className={styles.imagePreviewWrapper}
          columns={6}
          inputColumns={6}
          maxWidth={INPUT_MAX_WIDTHS.MEDIUM}
        >
          <ImagePreview
            imageUrl={imageUrl}
            label={t(`event.form.buttonAddImage.${type}`)}
            onClick={openModal}
          />
        </InputWrapper>
      </InputRow>

      <div className={styles.imageDetailsRow}>
        <div className={styles.buttonColumn}>
          <InputWrapper
            className={styles.buttonWrapper}
            columns={6}
            inputColumns={6}
            maxWidth={INPUT_MAX_WIDTHS.MEDIUM}
          >
            {!!images.length ? (
              <Button
                fullWidth={true}
                iconLeft={<IconMinusCircle />}
                onClick={removeImage}
              >
                {t(`event.form.buttonRemoveImage.${type}`)}
              </Button>
            ) : (
              <Button
                fullWidth={true}
                iconLeft={<IconPlusCircle />}
                onClick={openModal}
              >
                {t(`event.form.buttonAddImage.${type}`)}
              </Button>
            )}
          </InputWrapper>
        </div>
        <div className={styles.imageDetailsColumn}>
          <ImageDetailsFields
            field={EVENT_FIELDS.IMAGE_DETAILS}
            imageAtId={imageAtId}
          />
        </div>
      </div>
    </>
  );
};

export default ImageSection;
