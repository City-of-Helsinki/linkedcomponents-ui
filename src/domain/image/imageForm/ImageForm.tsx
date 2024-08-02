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
import { ROUTES } from '../../../constants';
import { ImageFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../utils/validationUtils';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
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
import {
  checkCanUserDoAction,
  getImageFields,
  getImageInitialValues,
} from '../utils';
import { getFocusableImageFieldId, imageSchema } from '../validation';

type ImageFormProps = {
  image?: ImageFieldsFragment;
};

const ImageForm: React.FC<ImageFormProps> = ({ image }) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const navigate = useNavigate();
  const { user } = useUser();

  const action = image ? IMAGE_ACTIONS.UPDATE : IMAGE_ACTIONS.CREATE;
  const savedImagePublisher = getValue(image?.publisher, '');

  const { organizationAncestors } =
    useOrganizationAncestors(savedImagePublisher);

  const isEditingAllowed = checkCanUserDoAction({
    action,
    organizationAncestors,
    publisher: savedImagePublisher,
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
        addNotification({
          label: t('image.form.notificationImageUpdated'),
          type: 'success',
        });
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

      onSubmit={
        /* istanbul ignore next */
        () => undefined
      }
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
              getFocusableFieldId: getFocusableImageFieldId,
            });
          }
        };

        const setImageFields = (image: ImageFieldsFragment) => {
          const { altText, id, license, name, photographerName, url } =
            getImageFields(image, locale);

          setFieldValue(IMAGE_FIELDS.ID, id);
          setFieldValue(IMAGE_FIELDS.URL, url);
          setFieldValue(IMAGE_FIELDS.ALT_TEXT, altText);
          setFieldValue(IMAGE_FIELDS.NAME, name);
          setFieldValue(IMAGE_FIELDS.PHOTOGRAPHER_NAME, photographerName);
          setFieldValue(IMAGE_FIELDS.LICENSE, license);
        };

        const publisher = image
          ? getValue(image.publisher, '')
          : values.publisher;

        const disabledIfPublisherSelected =
          !isEditingAllowed || !!values.publisher;
        const disabledIfNoPublisherSelected =
          !isEditingAllowed || !values.publisher;
        const disabledIfNoUrl = !isEditingAllowed || !values.url;

        return (
          <>
            <AddImageModal
              isOpen={openModal === IMAGE_MODALS.ADD_IMAGE}
              onAddImage={() =>
                uploadImage({ publisher: values.publisher }, setImageFields)
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
            <Form noValidate={true}>
              <ImageAuthenticationNotification
                action={action}
                publisher={publisher}
              />
              <ServerErrorSummary errors={serverErrorItems} />

              <FormRow>
                <Field
                  alignedLabel
                  className={styles.alignedSelect}
                  component={PublisherSelectorField}
                  disabled={disabledIfPublisherSelected}
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
                      onClick={
                        /* istanbul ignore next */
                        () => undefined
                      }
                    />
                    {!values.url && (
                      <Button
                        className={styles.addButton}
                        disabled={disabledIfNoPublisherSelected}
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

              <FormRow>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  disabled={disabledIfNoUrl}
                  label={t('image.form.labelAltText')}
                  name={IMAGE_FIELDS.ALT_TEXT}
                  placeholder={t('image.form.placeholderAltText')}
                  required={true}
                />
              </FormRow>

              <FormRow>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  disabled={disabledIfNoUrl}
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
                  disabled={disabledIfNoUrl}
                  label={t(`image.form.labelPhotographerName`)}
                  name={IMAGE_FIELDS.PHOTOGRAPHER_NAME}
                  placeholder={t(`image.form.placeholderPhotographerName`)}
                />
              </FormRow>
              <FormRow>
                <h3>{t(`image.form.titleLicense`)}</h3>
                <Field
                  disabled={disabledIfNoUrl}
                  component={RadioButtonGroupField}
                  label={t(`image.form.titleLicense`)}
                  name={IMAGE_FIELDS.LICENSE}
                  options={licenseOptions}
                  required
                />
              </FormRow>

              {image ? (
                <EditButtonPanel
                  id={values.id}
                  onSave={handleSubmit}
                  publisher={publisher}
                  saving={saving}
                />
              ) : (
                <CreateButtonPanel
                  onSave={handleSubmit}
                  publisher={publisher}
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
