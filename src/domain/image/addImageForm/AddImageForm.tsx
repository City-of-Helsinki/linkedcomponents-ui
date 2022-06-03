import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import ImageSelectorField from '../../../common/components/formFields/imageSelectorField/ImageSelectorField';
import TextInputField from '../../../common/components/formFields/textInputField/TextInputField';
import ImageUploader from '../../../common/components/imageUploader/ImageUploader';
import { Image } from '../../../generated/graphql';
import { ADD_IMAGE_FIELDS, ADD_IMAGE_INITIAL_VALUES } from '../constants';
import useIsImageUploadAllowed from '../hooks/useIsImageUploadAllowed';
import { AddImageSettings } from '../types';
import { addImageSchema } from '../validation';
import styles from './addImageForm.module.scss';

export interface AddImageFormProps {
  onCancel: () => void;
  onFileChange: (file: File) => void;
  onSubmit: (values: AddImageSettings) => void;
  publisher: string;
  showImageSelector?: boolean;
}

const AddImageForm: React.FC<AddImageFormProps> = ({
  onCancel,
  onFileChange,
  onSubmit,
  publisher,
  showImageSelector = true,
}) => {
  const { t } = useTranslation();
  const { allowed, warning } = useIsImageUploadAllowed({ publisher });

  return (
    <Formik
      initialValues={ADD_IMAGE_INITIAL_VALUES}
      onSubmit={(values) => {
        onSubmit(values);
      }}
      validateOnMount={true}
      validationSchema={addImageSchema}
    >
      {({ values: { selectedImage, url }, isValid }) => {
        return (
          <Form className={styles.addImageForm}>
            {showImageSelector && (
              <>
                <h3>{t('image.form.titleUseImportedImage')}</h3>
                <Field
                  name={ADD_IMAGE_FIELDS.SELECTED_IMAGE}
                  component={ImageSelectorField}
                  disabled={Boolean(url)}
                  multiple={false}
                  onDoubleClick={(image: Image) => {
                    onSubmit({
                      [ADD_IMAGE_FIELDS.SELECTED_IMAGE]: [image.atId as string],
                      [ADD_IMAGE_FIELDS.URL]: '',
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
              onChange={onFileChange}
              title={warning}
            />
            <div className={styles.separationLine} />

            <h3>{t('image.form.titleImportFromInternet')}</h3>
            <div className={styles.imageUrlRow}>
              <div>
                <Field
                  disabled={!allowed || Boolean(selectedImage.length)}
                  name={ADD_IMAGE_FIELDS.URL}
                  component={TextInputField}
                  label={t(`image.form.labelUrl`)}
                  placeholder={t(`image.form.placeholderUrl`)}
                  title={warning}
                />
              </div>
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
