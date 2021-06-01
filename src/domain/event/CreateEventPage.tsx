import {
  ApolloClient,
  FetchResult,
  InMemoryCache,
  useApolloClient,
} from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import FormikPersist from '../../common/components/formikPersist/FormikPersist';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { FORM_NAMES, ROUTES } from '../../constants';
import {
  CreateEventsMutation,
  PublicationStatus,
  useCreateEventMutation,
  useCreateEventsMutation,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import { reportError } from '../app/sentry/utils';
import { clearEventsQueries } from '../events/utils';
import useUser from '../user/hooks/useUser';
import ButtonPanel from './buttonPanel/ButtonPanel';
import { EVENT_INFO_LANGUAGES, EVENT_INITIAL_VALUES } from './constants';
import styles from './eventPage.module.scss';
import AdditionalInfoSection from './formSections/additionalInfoSection/AdditionalInfoSection';
import AudienceSection from './formSections/audienceSection/AudienceSection';
import ChannelsSection from './formSections/channelsSection/ChannelsSection';
import ClassificationSection from './formSections/classificationSection/ClassificationSection';
import DescriptionSection from './formSections/descriptionSection/DescriptionSection';
import ImageSection from './formSections/imageSection/ImageSection';
import LanguagesSection from './formSections/languagesSection/LanguagesSection';
import PlaceSection from './formSections/placeSection/PlaceSection';
import PriceSection from './formSections/priceSection/PriceSection';
import ResponsibilitiesSection from './formSections/responsibilitiesSection/ResponsibilitiesSection';
import SummarySection from './formSections/summarySection/SummarySection';
import TimeSection from './formSections/timeSection/TimeSection';
import TypeSection from './formSections/typeSection/TypeSection';
import VideoSection from './formSections/videoSection/VideoSection';
import useEventFieldOptionsData from './hooks/useEventFieldOptionsData';
import useUpdateImageIfNeeded from './hooks/useUpdateImageIfNeeded';
import Section from './layout/Section';
import { EventFormFields } from './types';
import {
  draftEventSchema,
  getEventPayload,
  getRecurringEventPayload,
  publicEventSchema,
  showErrors,
} from './utils';

const CreateEventPage: React.FC = () => {
  const apolloClient = useApolloClient() as ApolloClient<InMemoryCache>;
  const history = useHistory();
  const location = useLocation();
  const locale = useLocale();
  const { t } = useTranslation();
  const { user } = useUser();
  const [createEventMutation] = useCreateEventMutation();
  const [createEventsMutation] = useCreateEventsMutation();
  const { updateImageIfNeeded } = useUpdateImageIfNeeded();
  const [descriptionLanguage, setDescriptionLanguage] = React.useState(
    EVENT_INITIAL_VALUES.eventInfoLanguages[0] as EVENT_INFO_LANGUAGES
  );
  const [saving, setSaving] = React.useState<PublicationStatus | null>(null);

  const goToEventSavedPage = (id: string) => {
    history.push(`/${locale}${ROUTES.EVENT_SAVED.replace(':id', id)}`);
  };

  const saveEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus
  ) => {
    setSaving(publicationStatus);
    try {
      await updateImageIfNeeded(values);
    } catch (error) /* istanbul ignore next */ {
      // Report error to Sentry
      reportError({
        data: {
          error,
          images: values.images,
          imageDetails: values.imageDetails,
        },
        location,
        message: 'Failed to update image',
        user,
      });
    }
    const payload = getEventPayload(values, publicationStatus);

    if (Array.isArray(payload)) {
      let eventsData: FetchResult<CreateEventsMutation> | null = null;

      try {
        eventsData = await createEventsMutation({
          variables: { input: payload },
        });
      } catch (error) /* istanbul ignore next */ {
        // Report error to Sentry
        reportError({
          data: {
            error,
            payload,
            payloadAsString: JSON.stringify(payload),
          },
          location,
          message: 'Failed to create sub-events event',
          user,
        });
        setSaving(null);
        return;
      }

      const subEventIds =
        eventsData?.data?.createEvents.map((item) => item.atId as string) ||
        /* istanbul ignore next */
        [];
      const recurringEventPayload = getRecurringEventPayload(
        payload,
        subEventIds
      );

      try {
        const recurringEventData = await createEventMutation({
          variables: { input: recurringEventPayload },
        });

        // Clear all events queries from apollo cache to show added events in event list
        clearEventsQueries(apolloClient);
        // This action will change LE response so clear event list page
        goToEventSavedPage(recurringEventData.data?.createEvent.id as string);
        setSaving(null);
      } catch (error) /* istanbul ignore next */ {
        // Report error to Sentry
        reportError({
          data: {
            error,
            payload: recurringEventPayload,
            payloadAsString: JSON.stringify(recurringEventPayload),
          },
          location,
          message: 'Failed to create recurring event',
          user,
        });
        setSaving(null);
      }
    } else {
      try {
        const data = await createEventMutation({
          variables: { input: payload },
        });

        // Clear all events queries from apollo cache to show added events in event list
        clearEventsQueries(apolloClient);
        // This action will change LE response so clear event list page
        goToEventSavedPage(data.data?.createEvent.id as string);
        setSaving(null);
      } catch (error) /* istanbul ignore next */ {
        // Report error to Sentry
        reportError({
          data: {
            error,
            payload,
            payloadAsString: JSON.stringify(payload),
          },
          location,
          message: 'Failed to create event',
          user,
        });
        setSaving(null);
      }
    }
  };

  const initialValues = React.useMemo(
    () => ({
      ...EVENT_INITIAL_VALUES,
      publisher: user?.organization ?? /* istanbul ignore next */ '',
    }),
    [user]
  );

  return (
    <Formik
      initialValues={initialValues}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={publicEventSchema}
      validateOnMount
      validateOnBlur={false}
      validateOnChange={true}
    >
      {({
        values: { publisher, type, ...restValues },
        setErrors,
        setTouched,
      }) => {
        const clearErrors = () => {
          setErrors({});
        };

        const handleSubmit = async (
          publicationStatus: PublicationStatus,
          event?: React.FormEvent<HTMLFormElement>
        ) => {
          event?.preventDefault();

          try {
            const values = { publisher, type, ...restValues };

            clearErrors();

            switch (publicationStatus) {
              case PublicationStatus.Draft:
                await draftEventSchema.validate(values, {
                  abortEarly: false,
                });
                break;
              case PublicationStatus.Public:
                await publicEventSchema.validate(values, {
                  abortEarly: false,
                });
                break;
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
              <MainContent>
                <Container withOffset={true}>
                  <Section title={t('event.form.sections.type')}>
                    <TypeSection />
                  </Section>
                  <Section title={t('event.form.sections.languages')}>
                    <LanguagesSection />
                  </Section>
                  <Section title={t('event.form.sections.responsibilities')}>
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
                  <Section title={t(`event.form.sections.channels.${type}`)}>
                    <ChannelsSection />
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
                </Container>
                <ButtonPanel
                  onSaveDraft={() => handleSubmit(PublicationStatus.Draft)}
                  publisher={publisher}
                  saving={saving}
                />
              </MainContent>
            </PageWrapper>
          </Form>
        );
      }}
    </Formik>
  );
};

const CreateEventPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  // Load options for inLanguage, audience and keywords checkboxes
  const { loading: loadingEventFieldOptions } = useEventFieldOptionsData();

  const loading = loadingEventFieldOptions || loadingUser;

  return (
    <LoadingSpinner isLoading={loading}>
      <CreateEventPage />
    </LoadingSpinner>
  );
};

export default CreateEventPageWrapper;
