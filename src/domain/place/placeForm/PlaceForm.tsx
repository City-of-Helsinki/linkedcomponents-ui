import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import PublisherSelectorField from '../../../common/components/formFields/PublisherSelectorField';
import TextAreaField from '../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import {
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
} from '../../../constants';
import { PlaceFieldsFragment } from '../../../generated/graphql';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import Section from '../../app/layout/Section';
import {
  PLACE_ACTIONS,
  PLACE_FIELDS,
  PLACE_INITIAL_VALUES,
} from '../constants';
import PlaceAuthenticationNotification from '../placeAuthenticationNotification/PlaceAuthenticationNotification';
import { getPlaceInitialValues } from '../utils';
import { placeSchema } from '../validation';

type PlaceFormProps = {
  place?: PlaceFieldsFragment;
};

const PlaceForm: React.FC<PlaceFormProps> = ({ place }) => {
  const { t } = useTranslation();

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
      {({ values }) => {
        return (
          <Form className={styles.form} noValidate={true}>
            <PlaceAuthenticationNotification
              action={place ? PLACE_ACTIONS.UPDATE : PLACE_ACTIONS.CREATE}
              publisher={place ? (place.publisher as string) : values.publisher}
            />

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
          </Form>
        );
      }}
    </Formik>
  );
};

export default PlaceForm;
