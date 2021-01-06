import { useApolloClient } from '@apollo/client';
import { Form, Formik } from 'formik';
import forEach from 'lodash/forEach';
import set from 'lodash/set';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import FormikPersist from '../../common/components/formikPersist/FormikPersist';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { FORM_NAMES, INCLUDE, KEYWORD_SETS, ROUTES } from '../../constants';
import {
  PublicationStatus,
  useCreateEventMutation,
  useCreateEventsMutation,
  useKeywordSetQuery,
  useLanguagesQuery,
  useUpdateImageMutation,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import parseIdFromAtId from '../../utils/parseIdFromAtId';
import Container from '../app/layout/Container';
import FormContainer from '../app/layout/FormContainer';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import { clearEventsQueries } from '../events/utils';
import { keywordSetPathBuilder } from '../keywordSet/utils';
import ButtonPanel from './buttonPanel/ButtonPanel';
import { EVENT_FIELDS, EVENT_INITIAL_VALUES } from './constants';
import styles from './eventPage.module.scss';
import AdditionalInfoSection from './formSections/additionalInfoSection/AdditionalInfoSection';
import AudienceSection from './formSections/audienceSection/AudienceSection';
import ClassificationSection from './formSections/classificationSection/ClassificationSection';
import DescriptionSection from './formSections/descriptionSection/DescriptionSection';
import ImageSection from './formSections/imageSection/ImageSection';
import LanguagesSection from './formSections/languagesSection/LanguagesSection';
import PlaceSection from './formSections/placeSection/PlaceSection';
import PriceSection from './formSections/priceSection/PriceSection';
import ResponsibilitiesSection from './formSections/responsibilitiesSection/ResponsibilitiesSection';
import SocialMediaSection from './formSections/socialMediaSection/SocialMediaSection';
import SummarySection from './formSections/summarySection/SummarySection';
import TimeSection from './formSections/timeSection/TimeSection';
import TypeSection from './formSections/typeSection/TypeSection';
import Section from './layout/Section';
import { EventFormFields } from './types';
import {
  clearEventFormData,
  draftEventValidationSchema,
  eventValidationSchema,
  getEventPayload,
  getRecurringEventPayload,
} from './utils';

const SELECT_FIELDS = [
  EVENT_FIELDS.KEYWORDS,
  EVENT_FIELDS.LOCATION,
  EVENT_FIELDS.SUPER_EVENT,
];

const CreateEventPage: React.FC = () => {
  const apolloClient = useApolloClient();
  const history = useHistory();
  const locale = useLocale();
  const { t } = useTranslation();
  const [createEventMutation] = useCreateEventMutation();
  const [createEventsMutation] = useCreateEventsMutation();
  const [updateImage] = useUpdateImageMutation();

  const { loading: loadingLanguages } = useLanguagesQuery();

  const { loading: loadingKeywords } = useKeywordSetQuery({
    variables: {
      createPath: getPathBuilder(keywordSetPathBuilder),
      id: KEYWORD_SETS.TOPICS,
      include: [INCLUDE.KEYWORDS],
    },
  });

  const { loading: loadingAudiences } = useKeywordSetQuery({
    variables: {
      createPath: getPathBuilder(keywordSetPathBuilder),
      id: KEYWORD_SETS.AUDIENCES,
      include: [INCLUDE.KEYWORDS],
    },
  });

  const loading = loadingLanguages || loadingKeywords || loadingAudiences;

  const goToEventSavedPage = (id: string) => {
    clearEventFormData();
    history.push(`/${locale}${ROUTES.EVENT_SAVED.replace(':id', id)}`);
  };

  const saveImageIfNeeded = async (values: EventFormFields) => {
    const { imageDetails, images } = values;
    const imageId = images[0];

    if (imageId) {
      await updateImage({
        variables: {
          input: {
            id: parseIdFromAtId(imageId) as string,
            ...imageDetails,
          },
        },
      });
    }
  };

  const saveEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus
  ) => {
    try {
      await saveImageIfNeeded(values);

      const payload = getEventPayload(values, publicationStatus);

      if (Array.isArray(payload)) {
        const eventsData = await createEventsMutation({
          variables: {
            input: payload,
          },
        });

        const subEventIds =
          eventsData.data?.createEvents.map((item) => item.atId as string) ||
          /* istanbul ignore next */
          [];
        const recurringEventPayload = getRecurringEventPayload(
          payload,
          subEventIds
        );

        const recurringEventData = await createEventMutation({
          variables: {
            input: recurringEventPayload,
          },
        });

        // Clear all events queries from apollo cache to show added events in event list
        clearEventsQueries(apolloClient);
        goToEventSavedPage(recurringEventData.data?.createEvent.id as string);
      } else {
        const data = await createEventMutation({
          variables: {
            input: payload,
          },
        });

        // Clear all events queries from apollo cache to show added events in event list
        clearEventsQueries(apolloClient);
        goToEventSavedPage(data.data?.createEvent.id as string);
      }
    } catch (e) {
      const { networkError } = e;

      /* istanbul ignore else */
      if (networkError) {
        switch (networkError.statusCode) {
          case 400:
            toast.error(t('errors.validationError'));
            break;
          case 401:
            toast.error(t('errors.authorizationRequired'));
            break;
          default:
            toast.error(t('errors.serverError'));
        }
      }
    }
  };

  return (
    <Formik
      initialValues={EVENT_INITIAL_VALUES}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={eventValidationSchema}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
    >
      {({ values: { type, ...restValues }, setErrors, setTouched }) => {
        const getFocusableFieldId = (fieldName: string): string => {
          // For the select elements, focus the toggle button
          if (SELECT_FIELDS.find((item) => item === fieldName)) {
            return `${fieldName}-input`;
          }

          return fieldName;
        };

        const scrollToFirstError = (error: Yup.ValidationError) => {
          forEach(error.inner, (e) => {
            const field = document.getElementById(getFocusableFieldId(e.path));

            /* istanbul ignore else */
            if (field) {
              field.focus();
              return false;
            }
          });
        };

        const showErrors = (error: Yup.ValidationError) => {
          /* istanbul ignore else */
          if (error.name === 'ValidationError') {
            const newErrors = error.inner.reduce(
              (acc: object, e: Yup.ValidationError) =>
                set(acc, e.path, e.errors[0]),
              {}
            );
            const touchedFields = error.inner.reduce(
              (acc: object, e: Yup.ValidationError) => set(acc, e.path, true),
              {}
            );

            setErrors(newErrors);
            setTouched(touchedFields);
            scrollToFirstError(error);
          }
        };

        const clearErrors = () => {
          setErrors({});
        };

        const saveDraft = async () => {
          try {
            const values = { type, ...restValues };

            clearErrors();
            await draftEventValidationSchema.validate(values, {
              abortEarly: false,
            });

            clearErrors();
            saveEvent(values, PublicationStatus.Draft);
          } catch (error) {
            showErrors(error);
          }
        };

        const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          try {
            const values = { type, ...restValues };

            clearErrors();

            await eventValidationSchema.validate(values, {
              abortEarly: false,
            });

            saveEvent(values, PublicationStatus.Public);
          } catch (error) {
            showErrors(error);
          }
        };

        return (
          <Form onSubmit={onSubmit} noValidate={true}>
            <FormikPersist
              name={FORM_NAMES.EVENT_FORM}
              isSessionStorage={true}
            />
            <PageWrapper
              className={styles.eventPage}
              title={`createEventPage.pageTitle.${type}`}
            >
              <LoadingSpinner isLoading={loading}>
                <MainContent>
                  <Container>
                    <FormContainer>
                      <Section title={t('event.form.sections.type')}>
                        <TypeSection />
                      </Section>
                      <Section title={t('event.form.sections.languages')}>
                        <LanguagesSection />
                      </Section>
                      <Section
                        title={t('event.form.sections.responsibilities')}
                      >
                        <ResponsibilitiesSection />
                      </Section>
                      <Section title={t('event.form.sections.description')}>
                        <DescriptionSection />
                      </Section>
                      <Section title={t('event.form.sections.time')}>
                        <TimeSection />
                      </Section>
                      <Section title={t('event.form.sections.place')}>
                        <PlaceSection />
                      </Section>
                      <Section title={t('event.form.sections.price')}>
                        <PriceSection />
                      </Section>
                      <Section title={t('event.form.sections.socialMedia')}>
                        <SocialMediaSection />
                      </Section>
                      <Section title={t('event.form.sections.image')}>
                        <ImageSection />
                      </Section>
                      <Section title={t('event.form.sections.classification')}>
                        <ClassificationSection />
                      </Section>
                      <Section title={t('event.form.sections.audience')}>
                        <AudienceSection />
                      </Section>
                      <Section title={t('event.form.sections.additionalInfo')}>
                        <AdditionalInfoSection />
                      </Section>

                      <SummarySection />
                    </FormContainer>
                  </Container>
                  <ButtonPanel onSaveDraft={saveDraft} />
                </MainContent>
              </LoadingSpinner>
            </PageWrapper>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateEventPage;
