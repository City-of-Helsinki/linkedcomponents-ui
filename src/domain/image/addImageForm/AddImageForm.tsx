import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PixelCrop } from 'react-image-crop';

import Button from '../../../common/components/button/Button';
import ImageSelectorField from '../../../common/components/formFields/imageSelectorField/ImageSelectorField';
import ImageUploader from '../../../common/components/imageUploader/ImageUploader';
import {
  getCompressedImageFile,
  getCroppedImageFile,
  getUpscaledImageFile,
} from '../../../common/components/imageUploader/utils';
import { MAX_IMAGE_SIZE_MB } from '../../../constants';
import { Image } from '../../../generated/graphql';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import { ADD_IMAGE_FIELDS, ADD_IMAGE_INITIAL_VALUES } from '../constants';
import useIsImageUploadAllowed from '../hooks/useIsImageUploadAllowed';
import { AddImageSettings } from '../types';
import { addImageSchema } from '../validation';
import styles from './addImageForm.module.scss';

export interface AddImageFormProps {
  onAddImageByFile: (file: File) => void;
  onCancel: () => void;
  onSubmit: (values: AddImageSettings) => void;
  publisher: string;
  showImageSelector?: boolean;
}

const AddImageForm: React.FC<AddImageFormProps> = ({
  onAddImageByFile,
  onCancel,
  onSubmit,
  publisher,
  showImageSelector = true,
}) => {
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const { allowed, warning } = useIsImageUploadAllowed({ publisher });

  const validateFileSize = (file: File): boolean => {
    const decimalFactor = 1000 * 1000;
    const fileSizeInMB = file.size / decimalFactor;

    return fileSizeInMB <= MAX_IMAGE_SIZE_MB;
  };

  return (
    <Formik
      initialValues={ADD_IMAGE_INITIAL_VALUES}
      onSubmit={async (values) => {
        if (values.imageCrop && values.imageFile) {
          const croppedImageFile = await getCroppedImageFile(
            imageEl as HTMLImageElement,
            values.imageCrop,
            values.imageFile
          );
          const upscaledImage = await getUpscaledImageFile(croppedImageFile);
          const compressedFile = await getCompressedImageFile(upscaledImage);

          if (!validateFileSize(compressedFile)) {
            addNotification({
              label: t('common.imageUploader.tooLargeFileSize', {
                maxSize: MAX_IMAGE_SIZE_MB,
              }),
              type: 'error',
            });
          } else {
            onAddImageByFile(compressedFile);
          }
        } else {
          onSubmit(values);
        }
      }}
      validateOnMount={true}
      validationSchema={addImageSchema}
    >
      {({ values: { selectedImage }, isValid, setFieldValue }) => {
        const handleImageFileChange = (
          file: File | null,
          crop: PixelCrop | null,
          image: HTMLImageElement | null
        ) => {
          setImageEl(image);
          setFieldValue(ADD_IMAGE_FIELDS.IMAGE_FILE, file, true);
          setFieldValue(ADD_IMAGE_FIELDS.IMAGE_CROP, crop, false);
        };

        return (
          <Form className={styles.addImageForm} noValidate={true}>
            {showImageSelector && (
              <>
                <h3>{t('image.form.titleUseImportedImage')}</h3>
                <Field
                  name={ADD_IMAGE_FIELDS.SELECTED_IMAGE}
                  component={ImageSelectorField}
                  multiple={false}
                  onDoubleClick={(image: Image) => {
                    onSubmit({
                      ...ADD_IMAGE_INITIAL_VALUES,
                      [ADD_IMAGE_FIELDS.SELECTED_IMAGE]: [image.atId],
                    });
                  }}
                  publisher={publisher}
                />
                <div className={styles.separationLine} />
              </>
            )}

            <h3>{t('image.form.titleImportFromHardDisk')}</h3>
            <ImageUploader
              disabled={!allowed}
              onChange={handleImageFileChange}
              title={warning}
            />
            <div className={styles.separationLine} />
            <div className={styles.imageUrlRow}>
              <div className={styles.buttonsColumn}>
                <div>
                  <Button
                    fullWidth={true}
                    onClick={onCancel}
                    type="button"
                    variant="secondary"
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
                <div>
                  <Button disabled={!isValid} fullWidth={true} type="submit">
                    {t('common.add')}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddImageForm;
