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
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import ImagePreview from '../../../../common/components/imagePreview/ImagePreview';
import { PAGE_SIZE } from '../../../../common/components/imageSelector/constants';
import Modal from '../../../../common/components/modal/Modal';
import Notification from '../../../../common/components/notification/Notification';
import { INPUT_MAX_WIDTHS } from '../../../../constants';
import {
  useImageQuery,
  useUploadImageMutation,
} from '../../../../generated/graphql';
import getPathBuilder from '../../../../utils/getPathBuilder';
import isTestEnv from '../../../../utils/isTestEnv';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import FieldColumn from '../../../app/layout/FieldColumn';
import FieldRow from '../../../app/layout/FieldRow';
import AddImageForm from '../../../image/addImageForm/AddImageForm';
import { AddImageSettings } from '../../../image/types';
import {
  clearImageQueries,
  clearImagesQueries,
  imagePathBuilder,
} from '../../../image/utils';
import { EVENT_FIELDS } from '../../constants';
import ImageDetailsFields from './imageDetailsFields/ImageDetailsFields';
import styles from './imageSection.module.scss';

const ImageSection: React.FC = () => {
  const { t } = useTranslation();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;

  const [isModalOpen, setIsmodalOpen] = React.useState(false);
  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: publisher }] = useField({ name: EVENT_FIELDS.PUBLISHER });

  const [uploadImageMutation] = useUploadImageMutation();
  const [{ value: images }, , { setValue: setImagesValue }] = useField({
    name: EVENT_FIELDS.IMAGES,
  });

  const imageAtId = images[0];

  const { data: imageData } = useImageQuery({
    skip: !imageAtId,
    variables: {
      createPath: getPathBuilder(imagePathBuilder),
      id: parseIdFromAtId(imageAtId) as string,
    },
  });

  const imageUrl = imageData?.image.url;

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

  const cleanAfterUpdate = async () => {
    /* istanbul ignore next */
    !isTestEnv && clearImageQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearImagesQueries(apolloClient);
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
        variables: { input: { image, name: '', publisher, url } },
      });
      cleanAfterUpdate();

      setImagesValue([data.data?.uploadImage.atId]);
      closeModal();
    } catch (e) {
      // Network errors will be handled on apolloClient error link. Only show error on console here.
      /* istanbul ignore next */
      // eslint-disable-next-line no-console
      console.error(e);
    }
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
          isOpen={isModalOpen}
          onClose={closeModal}
          shouldCloseOnEsc={false}
          title={t(`event.form.modalTitleImage.${type}`)}
        >
          <AddImageForm
            onCancel={closeModal}
            onFileChange={(image: File) => {
              uploadImage({ image });
            }}
            onSubmit={handleAddImageFormSubmit}
            publisher={publisher}
          />
        </Modal>
      )}

      <h3>{t(`event.form.titleImage.${type}`)}</h3>
      <FieldRow
        notification={
          <Notification
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
              imageUrl={imageUrl}
              label={t(`event.form.buttonAddImage.${type}`)}
              onClick={openModal}
            />
          </FormGroup>

          <FormGroup>
            {!!images.length ? (
              <Button
                fullWidth={true}
                iconLeft={<IconMinusCircle aria-hidden />}
                onClick={removeImage}
              >
                {t(`event.form.buttonRemoveImage.${type}`)}
              </Button>
            ) : (
              <Button
                fullWidth={true}
                iconLeft={<IconPlusCircle aria-hidden />}
                onClick={openModal}
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
    </>
  );
};

export default ImageSection;
