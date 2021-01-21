import { useApolloClient } from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  EventFieldsFragment,
  PublicationStatus,
  useEventQuery,
  useUpdateEventMutation,
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
import NotFound from '../notFound/NotFound';
import EditButtonPanel from './editButtonPanel/EditButtonPanel';
import EventInfo from './EventInfo';
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
import TimeSection from './formSections/timeSection/TimeSection';
import TypeSection from './formSections/typeSection/TypeSection';
import useEventFieldsData from './hooks/useEventFieldsData';
import Section from './layout/Section';
import { EventFormFields } from './types';
import {
  draftEventValidationSchema,
  eventPathBuilder,
  eventValidationSchema,
  getEventFields,
  getEventInitialValues,
  getEventPayload,
  showErrors,
} from './utils';

interface EditEventPageProps {
  event: EventFieldsFragment;
}

const EditEventPage: React.FC<EditEventPageProps> = ({ event }) => {
  const apolloClient = useApolloClient();
  const { t } = useTranslation();
  const history = useHistory();
  const locale = useLocale();
  const { id, name } = getEventFields(event, locale);
  const initialValues = React.useMemo(() => {
    return getEventInitialValues(event);
  }, [event]);

  const [updateEventMutation] = useUpdateEventMutation();
  const [updateImage] = useUpdateImageMutation();

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
      const subEvents = event.subEvents;
      if (subEvents.length) {
        alert('TODO: Save super event and sub events');
      } else {
        await saveImageIfNeeded(values);

        const payload = getEventPayload(values, publicationStatus);

        const data = await updateEventMutation({
          variables: {
            input: { id, ...payload },
          },
        });

        // Clear all events queries from apollo cache to show added events in event list
        clearEventsQueries(apolloClient);
        goToEventSavedPage(data.data?.updateEvent.id as string);
      }
    } catch (e) {
      // Network errors will be handled on apolloClient error link. Only show error on console here.
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={eventValidationSchema}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
    >
      {({ values, setErrors, setTouched }) => {
        const clearErrors = () => {
          setErrors({});
        };

        const handleUpdate = async (publicationStatus: PublicationStatus) => {
          try {
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

            clearErrors();
            saveEvent(values, publicationStatus);
          } catch (error) {
            showErrors(error, setErrors, setTouched);
          }
        };

        return (
          <Form noValidate={true}>
            <PageWrapper
              backgroundColor="coatOfArms"
              className={styles.eventPage}
              title={name}
            >
              <MainContent>
                <EditButtonPanel event={event} onUpdate={handleUpdate} />
                <Container>
                  <FormContainer className={styles.editPageContentContainer}>
                    <EventInfo event={event} />

                    <Section title={t('event.form.sections.type')}>
                      <TypeSection />
                    </Section>
                    <Section title={t('event.form.sections.languages')}>
                      <LanguagesSection />
                    </Section>
                    <Section title={t('event.form.sections.responsibilities')}>
                      <ResponsibilitiesSection savedEvent={event} />
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
                  </FormContainer>
                </Container>
              </MainContent>
            </PageWrapper>
          </Form>
        );
      }}
    </Formik>
  );
};

const EditEventPageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: eventData, loading: loadingEvent } = useEventQuery({
    fetchPolicy: 'no-cache',
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id,
      include: [
        'audience',
        'keywords',
        'location',
        'sub_events',
        'super_event',
      ],
    },
  });
  const { loading: loadingEventFieldsData } = useEventFieldsData();

  const loading = loadingEvent || loadingEventFieldsData;

  return (
    <LoadingSpinner isLoading={loading}>
      {eventData?.event ? (
        <EditEventPage event={eventData.event} />
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default EditEventPageWrapper;
