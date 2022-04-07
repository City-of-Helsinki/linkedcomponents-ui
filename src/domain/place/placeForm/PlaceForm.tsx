import { ServerError } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import PublisherSelectorField from '../../../common/components/formFields/PublisherSelectorField';
import TextAreaField from '../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import Map from '../../../common/components/map/Map';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import {
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
  ROUTES,
} from '../../../constants';
import { PlaceFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../utils/validationUtils';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import Section from '../../app/layout/Section';
import {
  PLACE_ACTIONS,
  PLACE_FIELDS,
  PLACE_INITIAL_VALUES,
} from '../constants';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import usePlaceServerErrors from '../hooks/usePlaceServerErrors';
import usePlaceUpdateActions from '../hooks/usePlaceUpdateActions';
import PlaceAuthenticationNotification from '../placeAuthenticationNotification/PlaceAuthenticationNotification';
import { PlaceFormFields } from '../types';
import { getPlaceInitialValues } from '../utils';
import { placeSchema } from '../validation';

type PlaceFormProps = {
  place?: PlaceFieldsFragment;
};

const PlaceForm: React.FC<PlaceFormProps> = ({ place }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();

  const { saving, updatePlace } = usePlaceUpdateActions({
    place: place as PlaceFieldsFragment,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    usePlaceServerErrors();

  const goToPlacesPage = () => {
    navigate(`/${locale}${ROUTES.PLACES}`);
  };

  const onUpdate = async (values: PlaceFormFields) => {
    await updatePlace(values, {
      onError: (error: ServerError) => showServerErrors({ error }),
      onSuccess: async () => {
        goToPlacesPage();
      },
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        place ? getPlaceInitialValues(place) : PLACE_INITIAL_VALUES
      }
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={/* istanbul ignore next */ () => undefined}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={placeSchema}
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

            await placeSchema.validate(values, { abortEarly: false });

            if (place) {
              await onUpdate(values);
            } else {
              // await createPlace(values);
            }
          } catch (error) {
            showFormErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });

            scrollToFirstError({ error: error as ValidationError });
          }
        };

        return (
          <Form className={styles.form} noValidate={true}>
            <PlaceAuthenticationNotification
              action={place ? PLACE_ACTIONS.UPDATE : PLACE_ACTIONS.CREATE}
              publisher={place ? (place.publisher as string) : values.publisher}
            />

            <ServerErrorSummary errors={serverErrorItems} />

            <FormRow className={styles.borderInMobile}>
              <Field
                className={styles.alignedInputWithFullBorder}
                component={TextInputField}
                label={t(`place.form.labelId`)}
                name={PLACE_FIELDS.ID}
                readOnly
              />
            </FormRow>
            <FormRow className={styles.borderInMobile}>
              <Field
                className={
                  place
                    ? styles.alignedInputWithFullBorder
                    : styles.alignedInput
                }
                component={TextInputField}
                label={t(`place.form.labelDataSource`)}
                name={PLACE_FIELDS.DATA_SOURCE}
                readOnly
              />
            </FormRow>
            <FormRow className={place && styles.borderInMobile}>
              <Field
                className={styles.alignedInput}
                component={TextInputField}
                label={t(`place.form.labelOriginId`)}
                name={PLACE_FIELDS.ORIGIN_ID}
                readOnly={!!place}
                required={true}
              />
            </FormRow>
            <FormRow>
              <Field
                className={styles.alignedSelect}
                clearable={!place}
                component={PublisherSelectorField}
                label={t(`place.form.labelPublisher`)}
                name={PLACE_FIELDS.PUBLISHER}
                disabled={!!place}
                required={true}
              />
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
                    label={`${t('place.form.labelName')} (${langText})`}
                    name={`${PLACE_FIELDS.NAME}.${language}`}
                    required={language === LE_DATA_LANGUAGES.FI}
                  />
                </FormRow>
              );
            })}

            {ORDERED_LE_DATA_LANGUAGES.map((language) => {
              const langText = lowerCaseFirstLetter(
                t(`form.inLanguage.${language}`)
              );

              return (
                <FormRow key={language}>
                  <Field
                    className={styles.alignedTextArea}
                    component={TextAreaField}
                    label={t('place.form.labelDescription', { langText })}
                    name={`${PLACE_FIELDS.DESCRIPTION}.${language}`}
                  />
                </FormRow>
              );
            })}

            {ORDERED_LE_DATA_LANGUAGES.map((language) => {
              const langText = lowerCaseFirstLetter(
                t(`form.inLanguage.${language}`)
              );

              return (
                <FormRow key={language}>
                  <Field
                    className={styles.alignedInput}
                    component={TextInputField}
                    label={t('place.form.labelInfoUrl', { langText })}
                    name={`${PLACE_FIELDS.INFO_URL}.${language}`}
                  />
                </FormRow>
              );
            })}

            <Section title={t('place.form.titleLocation')}>
              <FormRow>
                <Map
                  onChange={
                    /* istanbul ignore next */ (coordinates) =>
                      setFieldValue('coordinates', coordinates, true)
                  }
                  position={values.coordinates}
                />
              </FormRow>
            </Section>

            <Section title={t('place.form.titleContactInfo')}>
              <FormRow>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  label={t(`place.form.labelEmail`)}
                  name={PLACE_FIELDS.EMAIL}
                />
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
                      label={t('place.form.labelTelephone', { langText })}
                      name={`${PLACE_FIELDS.TELEPHONE}.${language}`}
                    />
                  </FormRow>
                );
              })}

              <FormRow>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  label={t(`place.form.labelContactType`)}
                  name={PLACE_FIELDS.CONTACT_TYPE}
                />
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
                      label={t('place.form.labelStreetAddress', { langText })}
                      name={`${PLACE_FIELDS.STREET_ADDRESS}.${language}`}
                    />
                  </FormRow>
                );
              })}

              {ORDERED_LE_DATA_LANGUAGES.map((language) => {
                const langText = lowerCaseFirstLetter(
                  t(`form.inLanguage.${language}`)
                );

                return (
                  <FormRow key={language}>
                    <Field
                      className={styles.alignedInput}
                      component={TextInputField}
                      label={t('place.form.labelAddressLocality', { langText })}
                      name={`${PLACE_FIELDS.ADDRESS_LOCALITY}.${language}`}
                    />
                  </FormRow>
                );
              })}

              <FormRow>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  label={t(`place.form.labelAddressRegion`)}
                  name={PLACE_FIELDS.ADDRESS_REGION}
                />
              </FormRow>

              <FormRow>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  label={t(`place.form.labelPostalCode`)}
                  name={PLACE_FIELDS.POSTAL_CODE}
                />
              </FormRow>

              <FormRow>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  label={t(`place.form.labelPostOfficeBoxNum`)}
                  name={PLACE_FIELDS.POST_OFFICE_BOX_NUM}
                />
              </FormRow>
            </Section>

            {place ? (
              <EditButtonPanel
                id={values.id}
                onSave={handleSubmit}
                publisher={place.publisher as string}
                saving={saving}
              />
            ) : null}
          </Form>
        );
      }}
    </Formik>
  );
};

export default PlaceForm;
