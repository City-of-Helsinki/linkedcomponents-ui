/* eslint-disable max-len */
import { ServerError } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import { IconPlusCircle } from 'hds-react';
import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import Button from '../../../common/components/button/Button';
import PublisherSelectorField from '../../../common/components/formFields/publisherSelectorField/PublisherSelectorField';
import RadioButtonGroupField from '../../../common/components/formFields/radioButtonGroupField/RadioButtonGroupField';
import TextInputField from '../../../common/components/formFields/textInputField/TextInputField';
import ImagePreview from '../../../common/components/imagePreview/ImagePreview';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import {
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
  ROUTES,
} from '../../../constants';
import { ImageFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getLocalisedObject from '../../../utils/getLocalisedObject';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../utils/validationUtils';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import {
  IMAGE_ACTIONS,
  IMAGE_FIELDS,
  IMAGE_INITIAL_VALUES,
  LICENSE_TYPES,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import useImageServerErrors from '../hooks/useImageServerErrors';
import useImageUpdateActions, {
  IMAGE_MODALS,
} from '../hooks/useImageUpdateActions';
import ImageAuthenticationNotification from '../imageAuthenticationNotification/ImageAuthenticationNotification';
import AddImageModal from '../modals/addImageModal/AddImageModal';
import { ImageFormFields } from '../types';
import { checkCanUserDoAction, getImageInitialValues } from '../utils';
import { getFocusableFieldId, imageSchema } from '../validation';

type ImageFormProps = {
  image?: ImageFieldsFragment;
};

const ImageForm: React.FC<ImageFormProps> = ({ image }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(
    image?.publisher ?? ''
  );

  const isEditingAllowed = checkCanUserDoAction({
    action: image ? IMAGE_ACTIONS.UPDATE : IMAGE_ACTIONS.CREATE,
    organizationAncestors,
    publisher: image?.publisher ?? '',
    user,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useImageServerErrors();

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

  const {
    closeModal,
    openModal,
    saving,
    setOpenModal,
    updateImage,
    uploadImage,
  } = useImageUpdateActions({
    image: image as ImageFieldsFragment,
  });

  const goToImagesPage = () => {
    navigate(`/${locale}${ROUTES.IMAGES}`);
  };

  const onUpdate = async (values: ImageFormFields) => {
    await updateImage(values, {
      onError: (error: ServerError) => showServerErrors({ error }),
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
      validationSchema={isEditingAllowed && imageSchema}
    >
      {({ setErrors, setFieldValue, setTouched, values }) => {
        const clearErrors = () => setErrors({});

        const handleSubmit = async (
          event?: React.FormEvent<HTMLFormElement>
        ) => {
          event?.preventDefault();

          try {
            setServerErrorItems([]);
            clearErrors();

            await imageSchema.validate(values, { abortEarly: false });

            await onUpdate(values);
          } catch (error) {
            showFormErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });

            scrollToFirstError({
              error: error as ValidationError,
              getFocusableFieldId,
            });
          }
        };

        const setImageFields = (image: ImageFieldsFragment) => {
          setFieldValue(IMAGE_FIELDS.ID, image.id);
          setFieldValue(IMAGE_FIELDS.URL, image.url);
          /* istanbul ignore next */
          setFieldValue(
            IMAGE_FIELDS.ALT_TEXT,
            getLocalisedObject(image.altText)
          );
          setFieldValue(IMAGE_FIELDS.NAME, image.name);
          /* istanbul ignore next */
          setFieldValue(
            IMAGE_FIELDS.PHOTOGRAPHER_NAME,
            image.photographerName ?? ''
          );
          setFieldValue(IMAGE_FIELDS.LICENSE, image.license);
        };

        return (
          <>
            <AddImageModal
              isOpen={openModal === IMAGE_MODALS.ADD_IMAGE}
              onAddImage={({ url }) =>
                uploadImage(
                  { publisher: values.publisher, url },
                  setImageFields
                )
              }
              onClose={closeModal}
              onAddImageByFile={(image) =>
                uploadImage(
                  { publisher: values.publisher, image },
                  setImageFields
                )
              }
              publisher={values.publisher}
              showImageSelector={false}
            />
            <Form className={styles.form} noValidate={true}>
              <ImageAuthenticationNotification
                action={image ? IMAGE_ACTIONS.UPDATE : IMAGE_ACTIONS.CREATE}
                publisher={
                  image ? (image.publisher as string) : values.publisher
                }
              />
              <ServerErrorSummary errors={serverErrorItems} />

              <FormRow>
                <Field
                  className={styles.alignedSelect}
                  component={PublisherSelectorField}
                  disabled={!isEditingAllowed || !!image?.publisher}
                  label={t(`image.form.labelPublisher`)}
                  name={IMAGE_FIELDS.PUBLISHER}
                />
              </FormRow>

              <FormRow>
                <div className={styles.imagePreviewWrapper}>
                  <label>{t(`image.form.labelImage`)}</label>
                  <div>
                    <ImagePreview
                      className={styles.imagePreview}
                      disabled={true}
                      imageUrl={values.url}
                      label={t(`event.form.buttonAddImage.general`)}
                      onClick={/* istanbul ignore next */ () => undefined}
                    />
                    {!values.url && (
                      <Button
                        className={styles.addButton}
                        disabled={!isEditingAllowed || !values.publisher}
                        fullWidth={true}
                        iconLeft={<IconPlusCircle aria-hidden />}
                        onClick={() => setOpenModal(IMAGE_MODALS.ADD_IMAGE)}
                      >
                        {t(`image.form.buttonAddImage`)}
                      </Button>
                    )}
                  </div>
                </div>
              </FormRow>

              {ORDERED_LE_DATA_LANGUAGES.map((language) => {
                const langText = lowerCaseFirstLetter(
                  t(`form.inLanguage.${language}`)
                );

                return (
                  <FormRow key={language}>
                    <Field
                      className={styles.alignedInput}
                      component={TextInputField}
                      disabled={!isEditingAllowed || !values.url}
                      label={`${t('image.form.labelAltText')} (${langText})`}
                      name={`${IMAGE_FIELDS.ALT_TEXT}.${language}`}
                      placeholder={`${t(
                        'image.form.placeholderAltText'
                      )} (${langText})`}
                      required={language === LE_DATA_LANGUAGES.FI}
                    />
                  </FormRow>
                );
              })}

              <FormRow>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  disabled={!isEditingAllowed || !values.url}
                  label={t(`image.form.labelName`)}
                  name={IMAGE_FIELDS.NAME}
                  placeholder={t(`image.form.placeholderName`)}
                  required
                />
              </FormRow>
              <FormRow>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  disabled={!isEditingAllowed || !values.url}
                  label={t(`image.form.labelPhotographerName`)}
                  name={IMAGE_FIELDS.PHOTOGRAPHER_NAME}
                  placeholder={t(`image.form.placeholderPhotographerName`)}
                />
              </FormRow>
              <FormRow>
                <h3>{t(`image.form.titleLicense`)}</h3>
                <Field
                  disabled={!isEditingAllowed || !values.url}
                  component={RadioButtonGroupField}
                  name={IMAGE_FIELDS.LICENSE}
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
              ) : (
                <CreateButtonPanel
                  onSave={handleSubmit}
                  publisher={values.publisher as string}
                  saving={saving}
                />
              )}
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default ImageForm;
