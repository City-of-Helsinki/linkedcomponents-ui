import { Field, Form, Formik } from 'formik';
import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import PublisherSelectorField from '../../../common/components/formFields/PublisherSelectorField';
import RadioButtonGroupField from '../../../common/components/formFields/RadioButtonGroupField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import ImagePreview from '../../../common/components/imagePreview/ImagePreview';
import { ROUTES } from '../../../constants';
import { ImageFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { scrollToFirstError } from '../../../utils/validationUtils';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import {
  IMAGE_ACTIONS,
  IMAGE_FIELDS,
  IMAGE_INITIAL_VALUES,
  LICENSE_TYPES,
} from '../constants';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import useImageUpdateActions from '../hooks/useImageUpdateActions';
import ImageAuthenticationNotification from '../imageAuthenticationNotification/ImageAuthenticationNotification';
import { ImageFormFields } from '../types';
import { getImageInitialValues } from '../utils';
import { imageSchema } from '../validation';

type ImageFormProps = {
  image?: ImageFieldsFragment;
};

const ImageForm: React.FC<ImageFormProps> = ({ image }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();

  const licenseOptions = [
    {
      label: t(`image.license.${camelCase(LICENSE_TYPES.CC_BY)}`),
      value: LICENSE_TYPES.CC_BY,
    },
    {
      label: t(`image.license.${camelCase(LICENSE_TYPES.EVENT_ONLY)}.general`),
      value: LICENSE_TYPES.EVENT_ONLY,
    },
  ];

  const { saving, updateImage } = useImageUpdateActions({
    image: image as ImageFieldsFragment,
  });

  const goToImagesPage = () => {
    navigate(`/${locale}${ROUTES.IMAGES}`);
  };

  const onUpdate = async (values: ImageFormFields) => {
    await updateImage(values, {
      // onError: (error: ServerError) => showServerErrors({ error }),
      onSuccess: async () => {
        goToImagesPage();
      },
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        image ? getImageInitialValues(image) : IMAGE_INITIAL_VALUES
      }
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={/* istanbul ignore next */ () => undefined}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={imageSchema}
    >
      {({ setErrors, values }) => {
        const clearErrors = () => setErrors({});

        const handleSubmit = async (
          event?: React.FormEvent<HTMLFormElement>
        ) => {
          event?.preventDefault();

          try {
            // setServerErrorItems([]);
            clearErrors();

            await imageSchema.validate(values, { abortEarly: false });

            if (image) {
              await onUpdate(values);
            } else {
            }
          } catch (error) {
            // showFormErrors({
            //   error: error as ValidationError,
            //   setErrors,
            //   setTouched,
            // });

            scrollToFirstError({ error: error as ValidationError });
          }
        };

        return (
          <Form className={styles.form} noValidate={true}>
            <ImageAuthenticationNotification
              action={image ? IMAGE_ACTIONS.UPDATE : IMAGE_ACTIONS.CREATE}
              publisher={image ? (image.publisher as string) : values.publisher}
            />
            <FormRow>
              <Field
                className={styles.alignedSelect}
                component={PublisherSelectorField}
                label={t(`image.form.labelPublisher`)}
                name={IMAGE_FIELDS.PUBLISHER}
                disabled={!!image?.publisher}
              />
            </FormRow>

            <FormRow>
              <div className={styles.imagePreviewWrapper}>
                <label>{t(`image.form.labelImage`)}</label>
                <div>
                  <ImagePreview
                    className={styles.imagePreview}
                    disabled={!!image}
                    imageUrl={values.url}
                    label={t(`event.form.buttonAddImage.general`)}
                    onClick={() => undefined}
                  />
                </div>
              </div>
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedInput}
                name={IMAGE_FIELDS.ALT_TEXT}
                component={TextInputField}
                label={t(`image.form.labelAltText`)}
                placeholder={t(`image.form.placeholderAltText`)}
                requred
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedInput}
                name={IMAGE_FIELDS.NAME}
                component={TextInputField}
                label={t(`image.form.labelName`)}
                placeholder={t(`image.form.placeholderName`)}
                required
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedInput}
                name={IMAGE_FIELDS.PHOTOGRAPHER_NAME}
                component={TextInputField}
                label={t(`image.form.labelPhotographerName`)}
                placeholder={t(`image.form.placeholderPhotographerName`)}
              />
            </FormRow>
            <FormRow>
              <h3>{t(`image.form.titleLicense`)}</h3>
              <Field
                name={IMAGE_FIELDS.LICENSE}
                component={RadioButtonGroupField}
                options={licenseOptions}
              />
            </FormRow>

            {image ? (
              <EditButtonPanel
                id={values.id}
                onSave={handleSubmit}
                publisher={image.publisher as string}
                saving={saving}
              />
            ) : null}
          </Form>
        );
      }}
    </Formik>
  );
};

export default ImageForm;
