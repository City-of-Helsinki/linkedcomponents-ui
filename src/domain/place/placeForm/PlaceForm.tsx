/* eslint-disable max-len */
import {
  ApolloClient,
  NormalizedCacheObject,
  ServerError,
  useApolloClient,
} from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import PublisherSelectorField from '../../../common/components/formFields/publisherSelectorField/PublisherSelectorField';
import TextAreaField from '../../../common/components/formFields/textAreaField/TextAreaField';
import TextInputField from '../../../common/components/formFields/textInputField/TextInputField';
import Map from '../../../common/components/map/Map';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import {
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
  ROUTES,
} from '../../../constants';
import {
  CreatePlaceMutationInput,
  PlaceFieldsFragment,
  useCreatePlaceMutation,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../utils/validationUtils';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import { clearPlacesQueries } from '../../app/apollo/clearCacheUtils';
import Section from '../../app/layout/section/Section';
import { reportError } from '../../app/sentry/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import {
  PLACE_ACTIONS,
  PLACE_FIELDS,
  PLACE_INITIAL_VALUES,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import usePlaceServerErrors from '../hooks/usePlaceServerErrors';
import usePlaceUpdateActions from '../hooks/usePlaceUpdateActions';
import PlaceAuthenticationNotification from '../placeAuthenticationNotification/PlaceAuthenticationNotification';
import { PlaceFormFields } from '../types';
import {
  checkCanUserDoAction,
  getFocusableFieldId,
  getPlaceInitialValues,
  getPlacePayload,
} from '../utils';
import { placeSchema } from '../validation';

type PlaceFormProps = {
  place?: PlaceFieldsFragment;
};

const PlaceForm: React.FC<PlaceFormProps> = ({ place }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;

  const action = place ? PLACE_ACTIONS.UPDATE : PLACE_ACTIONS.CREATE;
  const savedPlacePublisher = getValue(place?.publisher, '');

  const { organizationAncestors } =
    useOrganizationAncestors(savedPlacePublisher);

  const isEditingAllowed = checkCanUserDoAction({
    action,
    organizationAncestors,
    publisher: savedPlacePublisher,
    user,
  });

  const { saving, setSaving, updatePlace } = usePlaceUpdateActions({
    place: place as PlaceFieldsFragment,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    usePlaceServerErrors();

  const [createPlaceMutation] = useCreatePlaceMutation();

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

  const createSinglePlace = async (payload: CreatePlaceMutationInput) => {
    try {
      const data = await createPlaceMutation({ variables: { input: payload } });

      return getValue(data.data?.createPlace.id, '');
    } catch (error) /* istanbul ignore next */ {
      showServerErrors({ error });
      // // Report error to Sentry
      reportError({
        data: {
          error: error as Record<string, unknown>,
          payload,
          payloadAsString: JSON.stringify(payload),
        },
        location,
        message: 'Failed to create place',
        user,
      });
    }
  };

  const createPlace = async (values: PlaceFormFields) => {
    setSaving(PLACE_ACTIONS.CREATE);
    const payload = getPlacePayload(values);

    const createdPlaceId = await createSinglePlace(payload);

    if (createdPlaceId) {
      // Clear all place queries from apollo cache to show added place
      // in place list
      clearPlacesQueries(apolloClient);
      goToPlacesPage();
    }

    setSaving(null);
  };

  const inputRowBorderStyle = useMemo(
    () =>
      /* istanbul ignore next */
      isEditingAllowed ? '' : styles.borderInMobile,
    [isEditingAllowed]
  );

  const inputRowBorderStyleIfPlace = useMemo(
    () => (!isEditingAllowed || place ? styles.borderInMobile : ''),
    [isEditingAllowed, place]
  );

  const alignedInputStyle = useMemo(
    () =>
      /* istanbul ignore next */
      isEditingAllowed
        ? styles.alignedInput
        : styles.alignedInputWithFullBorder,
    [isEditingAllowed]
  );

  const alignedInputStyleIfPlace = useMemo(
    () =>
      !isEditingAllowed || place
        ? styles.alignedInputWithFullBorder
        : styles.alignedInput,
    [isEditingAllowed, place]
  );

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
      validationSchema={isEditingAllowed && placeSchema}
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
              await createPlace(values);
            }
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

        const publisher = place
          ? getValue(place.publisher, '')
          : values.publisher;

        const disabledIfPlace = !isEditingAllowed || !!place;

        return (
          <Form noValidate={true}>
            <PlaceAuthenticationNotification
              action={action}
              publisher={publisher}
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
                className={alignedInputStyleIfPlace}
                component={TextInputField}
                label={t(`place.form.labelDataSource`)}
                name={PLACE_FIELDS.DATA_SOURCE}
                readOnly
              />
            </FormRow>
            <FormRow className={inputRowBorderStyleIfPlace}>
              <Field
                className={styles.alignedInput}
                component={TextInputField}
                label={t(`place.form.labelOriginId`)}
                name={PLACE_FIELDS.ORIGIN_ID}
                readOnly={disabledIfPlace}
                required={!place}
              />
            </FormRow>
            <FormRow>
              <Field
                alignedLabel
                className={styles.alignedSelect}
                clearable={!place}
                component={PublisherSelectorField}
                disabled={disabledIfPlace}
                label={t(`place.form.labelPublisher`)}
                name={PLACE_FIELDS.PUBLISHER}
                required={true}
              />
            </FormRow>
            {ORDERED_LE_DATA_LANGUAGES.map((language) => {
              const langText = lowerCaseFirstLetter(
                t(`form.inLanguage.${language}`)
              );

              return (
                <FormRow key={language} className={inputRowBorderStyle}>
                  <Field
                    className={alignedInputStyle}
                    component={TextInputField}
                    label={`${t('place.form.labelName')} (${langText})`}
                    name={`${PLACE_FIELDS.NAME}.${language}`}
                    readOnly={!isEditingAllowed}
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
                <FormRow key={language} className={inputRowBorderStyle}>
                  <Field
                    className={alignedInputStyle}
                    component={TextAreaField}
                    label={t('place.form.labelDescription', { langText })}
                    name={`${PLACE_FIELDS.DESCRIPTION}.${language}`}
                    readOnly={!isEditingAllowed}
                  />
                </FormRow>
              );
            })}

            {ORDERED_LE_DATA_LANGUAGES.map((language) => {
              const langText = lowerCaseFirstLetter(
                t(`form.inLanguage.${language}`)
              );

              return (
                <FormRow key={language} className={inputRowBorderStyle}>
                  <Field
                    className={alignedInputStyle}
                    component={TextInputField}
                    label={t('place.form.labelInfoUrl', { langText })}
                    name={`${PLACE_FIELDS.INFO_URL}.${language}`}
                    readOnly={!isEditingAllowed}
                  />
                </FormRow>
              );
            })}

            <Section title={t('place.form.titleLocation')}>
              <FormRow>
                {!isTestEnv && (
                  // istanbul ignore next
                  <Map
                    disabled={!isEditingAllowed}
                    onChange={
                      /* istanbul ignore next */
                      (coordinates) =>
                        setFieldValue('coordinates', coordinates, true)
                    }
                    position={values.coordinates}
                  />
                )}
              </FormRow>
            </Section>

            <Section title={t('place.form.titleContactInfo')}>
              <FormRow className={inputRowBorderStyle}>
                <Field
                  className={alignedInputStyle}
                  component={TextInputField}
                  label={t(`place.form.labelEmail`)}
                  name={PLACE_FIELDS.EMAIL}
                  readOnly={!isEditingAllowed}
                />
              </FormRow>

              {ORDERED_LE_DATA_LANGUAGES.map((language) => {
                const langText = lowerCaseFirstLetter(
                  t(`form.inLanguage.${language}`)
                );

                return (
                  <FormRow key={language} className={inputRowBorderStyle}>
                    <Field
                      className={alignedInputStyle}
                      component={TextInputField}
                      label={t('place.form.labelTelephone', { langText })}
                      name={`${PLACE_FIELDS.TELEPHONE}.${language}`}
                      readOnly={!isEditingAllowed}
                    />
                  </FormRow>
                );
              })}

              <FormRow className={inputRowBorderStyle}>
                <Field
                  className={alignedInputStyle}
                  component={TextInputField}
                  label={t(`place.form.labelContactType`)}
                  name={PLACE_FIELDS.CONTACT_TYPE}
                  readOnly={!isEditingAllowed}
                />
              </FormRow>

              {ORDERED_LE_DATA_LANGUAGES.map((language) => {
                const langText = lowerCaseFirstLetter(
                  t(`form.inLanguage.${language}`)
                );

                return (
                  <FormRow key={language} className={inputRowBorderStyle}>
                    <Field
                      className={alignedInputStyle}
                      component={TextInputField}
                      label={t('place.form.labelStreetAddress', { langText })}
                      name={`${PLACE_FIELDS.STREET_ADDRESS}.${language}`}
                      readOnly={!isEditingAllowed}
                    />
                  </FormRow>
                );
              })}

              {ORDERED_LE_DATA_LANGUAGES.map((language) => {
                const langText = lowerCaseFirstLetter(
                  t(`form.inLanguage.${language}`)
                );

                return (
                  <FormRow key={language} className={inputRowBorderStyle}>
                    <Field
                      className={alignedInputStyle}
                      component={TextInputField}
                      label={t('place.form.labelAddressLocality', { langText })}
                      name={`${PLACE_FIELDS.ADDRESS_LOCALITY}.${language}`}
                      readOnly={!isEditingAllowed}
                    />
                  </FormRow>
                );
              })}

              <FormRow className={inputRowBorderStyle}>
                <Field
                  className={alignedInputStyle}
                  component={TextInputField}
                  label={t(`place.form.labelAddressRegion`)}
                  name={PLACE_FIELDS.ADDRESS_REGION}
                  readOnly={!isEditingAllowed}
                />
              </FormRow>

              <FormRow className={inputRowBorderStyle}>
                <Field
                  className={alignedInputStyle}
                  component={TextInputField}
                  label={t(`place.form.labelPostalCode`)}
                  name={PLACE_FIELDS.POSTAL_CODE}
                  readOnly={!isEditingAllowed}
                />
              </FormRow>

              <FormRow className={inputRowBorderStyle}>
                <Field
                  className={alignedInputStyle}
                  component={TextInputField}
                  label={t(`place.form.labelPostOfficeBoxNum`)}
                  name={PLACE_FIELDS.POST_OFFICE_BOX_NUM}
                  readOnly={!isEditingAllowed}
                />
              </FormRow>
            </Section>

            {place ? (
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
        );
      }}
    </Formik>
  );
};

export default PlaceForm;
