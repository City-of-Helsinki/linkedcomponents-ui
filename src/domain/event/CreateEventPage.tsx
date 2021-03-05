import { useApolloClient } from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import FormikPersist from '../../common/components/formikPersist/FormikPersist';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { FORM_NAMES, ROUTES } from '../../constants';
import {
  PublicationStatus,
  useCreateEventMutation,
  useCreateEventsMutation,
  useUpdateImageMutation,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import parseIdFromAtId from '../../utils/parseIdFromAtId';
import Container from '../app/layout/Container';
import FormContainer from '../app/layout/FormContainer';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import { clearEventsQueries, resetEventListPage } from '../events/utils';
import ButtonPanel from './buttonPanel/ButtonPanel';
import { EVENT_INFO_LANGUAGES, EVENT_INITIAL_VALUES } from './constants';
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
import VideoSection from './formSections/videoSection/VideoSection';
import useEventFieldOptionsData from './hooks/useEventFieldOptionsData';
import Section from './layout/Section';
import { EventFormFields } from './types';
import {
  draftEventValidationSchema,
  eventValidationSchema,
  getEventPayload,
  getRecurringEventPayload,
  showErrors,
} from './utils';

const CreateEventPage: React.FC = () => {
  const apolloClient = useApolloClient();
  const history = useHistory();
  const locale = useLocale();
  const { t } = useTranslation();
  const [createEventMutation] = useCreateEventMutation();
  const [createEventsMutation] = useCreateEventsMutation();
  const [updateImage] = useUpdateImageMutation();
  const [descriptionLanguage, setDescriptionLanguage] = React.useState(
    EVENT_INITIAL_VALUES.eventInfoLanguages[0] as EVENT_INFO_LANGUAGES
  );

  // Load options for inLanguage, audience and keywords checkboxes
  const { loading } = useEventFieldOptionsData();

  const goToEventSavedPage = (id: string) => {
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
        // This action will change LE response so clear event list page
        resetEventListPage();
        goToEventSavedPage(recurringEventData.data?.createEvent.id as string);
      } else {
        const data = await createEventMutation({
          variables: {
            input: payload,
          },
        });

        // Clear all events queries from apollo cache to show added events in event list
        clearEventsQueries(apolloClient);
        // This action will change LE response so clear event list page
        resetEventListPage();
        goToEventSavedPage(data.data?.createEvent.id as string);
      }
    } catch (e) /* istanbul ignore next */ {
      // Network errors will be handled on apolloClient error link. Only show error on console here.
      // eslint-disable-next-line no-console
      console.error(e);
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
        const clearErrors = () => {
          setErrors({});
        };

        const handleSubmit = async (
          publicationStatus: PublicationStatus,
          event?: React.FormEvent<HTMLFormElement>
        ) => {
          event?.preventDefault();
          try {
            const values = { type, ...restValues };

            clearErrors();

            if (publicationStatus === PublicationStatus.Draft) {
              await draftEventValidationSchema.validate(values, {
                abortEarly: false,
              });
            } else {
              await eventValidationSchema.validate(values, {
                abortEarly: false,
              });
            }

            saveEvent(values, publicationStatus);
          } catch (error) {
            showErrors({
              descriptionLanguage,
              error,
              setErrors,
              setDescriptionLanguage,
              setTouched,
            });
          }
        };

        return (
          <Form
            onSubmit={(event) => handleSubmit(PublicationStatus.Public, event)}
            noValidate={true}
          >
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
                        <DescriptionSection
                          selectedLanguage={descriptionLanguage}
                          setSelectedLanguage={setDescriptionLanguage}
                        />
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
                      <Section title={t('event.form.sections.video')}>
                        <VideoSection />
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
                  <ButtonPanel
                    onSaveDraft={() => handleSubmit(PublicationStatus.Draft)}
                  />
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
