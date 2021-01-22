import { useApolloClient } from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  EventFieldsFragment,
  EventStatus,
  PublicationStatus,
  SuperEventType,
  UpdateEventMutationInput,
  useEventQuery,
  useUpdateEventsMutation,
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
import { EVENT_INCLUDES } from './constants';
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
import useRelatedEvents from './hooks/useRelatedEvents';
import Section from './layout/Section';
import ConfirmCancelModal from './modals/ConfirmCancelModal';
import ConfirmPostponeModal from './modals/ConfirmPostponeModal';
import ConfirmUpdateModal from './modals/ConfirmUpdateModal';
import { EventFormFields } from './types';
import {
  draftEventValidationSchema,
  eventPathBuilder,
  eventValidationSchema,
  getEventFields,
  getEventInitialValues,
  getEventPayload,
  getRelatedEvents,
  showErrors,
} from './utils';

interface EditEventPageProps {
  event: EventFieldsFragment;
}

enum MODALS {
  CANCEL = 'cancel',
  POSTPONE = 'postpone',
  UPDATE = 'update',
}

const EditEventPage: React.FC<EditEventPageProps> = ({ event }) => {
  const apolloClient = useApolloClient();
  const { t } = useTranslation();
  const history = useHistory();
  const locale = useLocale();
  const { atId, id, name, publicationStatus, superEventType } = getEventFields(
    event,
    locale
  );
  const [modal, setModal] = React.useState<MODALS | null>(null);
  const [nextPublicationStatus, setNextPublicationStatus] = React.useState(
    publicationStatus
  );

  const initialValues = React.useMemo(() => {
    return getEventInitialValues(event);
  }, [event]);

  const [updateEventsMutation] = useUpdateEventsMutation();
  const [updateImage] = useUpdateImageMutation();
  // Prefetch all related events which are used when postpone/delete/cancel events
  useRelatedEvents(event);

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

  const updateEvents = async (payload: UpdateEventMutationInput[]) => {
    await updateEventsMutation({
      variables: {
        input: payload,
      },
    });

    // Clear all events queries from apollo cache to show edited events in event list
    clearEventsQueries(apolloClient);
    goToEventSavedPage(id);
  };

  const cancelEvent = async () => {
    try {
      // Make sure all related events are fetched
      const allEvents = await getRelatedEvents({ apolloClient, event });
      const payload: UpdateEventMutationInput[] = allEvents.map((item) => ({
        ...getEventPayload(
          getEventInitialValues(item),
          item.publicationStatus as PublicationStatus
        ),
        eventStatus: EventStatus.EventCancelled,
        id: item.id,
      }));

      await updateEvents(payload);
    } catch (e) {
      // Network errors will be handled on apolloClient error link. Only show error on console here.
      /* istanbul ignore next  */
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const postponeEvent = async () => {
    try {
      // Make sure all related events are fetched
      const allEvents = await getRelatedEvents({ apolloClient, event });
      const payload: UpdateEventMutationInput[] = allEvents.map((item) => ({
        ...getEventPayload(
          getEventInitialValues(item),
          item.publicationStatus as PublicationStatus
        ),
        id: item.id,
        startTime: null,
        endTime: null,
      }));

      await updateEvents(payload);
    } catch (e) {
      // Network errors will be handled on apolloClient error link. Only show error on console here.
      /* istanbul ignore next  */
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const saveEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus
  ) => {
    try {
      const subEvents = event.subEvents;

      await saveImageIfNeeded(values);

      const basePayload = getEventPayload(values, publicationStatus);
      const payload: UpdateEventMutationInput[] = [{ ...basePayload, id }];

      if (superEventType === SuperEventType.Recurring) {
        payload.push(
          ...subEvents
            // Editing cancelled events is not allowed so filter them out to avoid server error
            .filter(
              (subEvents) =>
                subEvents?.eventStatus !== EventStatus.EventCancelled
            )
            .map((subEvent) => ({
              ...basePayload,
              id: subEvent?.id as string,
              startTime: subEvent?.startTime,
              endTime: subEvent?.endTime,
              superEvent: { atId },
              superEventType: subEvent?.superEventType,
            }))
        );
      }

      await updateEvents(payload);
    } catch (e) {
      // Network errors will be handled on apolloClient error link. Only show error on console here.
      /* istanbul ignore next  */
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const closeModal = () => {
    setModal(null);
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

            if (superEventType === SuperEventType.Recurring) {
              setNextPublicationStatus(publicationStatus);
              setModal(MODALS.UPDATE);
            } else {
              saveEvent(values, publicationStatus);
            }
          } catch (error) {
            showErrors(error, setErrors, setTouched);
          }
        };

        return (
          <>
            <ConfirmCancelModal
              event={event}
              isOpen={modal === MODALS.CANCEL}
              onCancel={() => {
                closeModal();
                cancelEvent();
              }}
              onClose={closeModal}
            />
            <ConfirmPostponeModal
              event={event}
              isOpen={modal === MODALS.POSTPONE}
              onClose={closeModal}
              onPostpone={() => {
                closeModal();
                postponeEvent();
              }}
            />
            <ConfirmUpdateModal
              event={event}
              isOpen={modal === MODALS.UPDATE}
              onClose={closeModal}
              onSave={() => {
                closeModal();
                saveEvent(values, nextPublicationStatus);
              }}
            />
            <Form noValidate={true}>
              <PageWrapper
                backgroundColor="coatOfArms"
                className={styles.eventPage}
                title={name}
              >
                <MainContent>
                  <EditButtonPanel
                    event={event}
                    onCancel={() => setModal(MODALS.CANCEL)}
                    onPostpone={() => setModal(MODALS.POSTPONE)}
                    onUpdate={handleUpdate}
                  />
                  <Container>
                    <FormContainer className={styles.editPageContentContainer}>
                      <EventInfo event={event} />

                      <Section title={t('event.form.sections.type')}>
                        <TypeSection />
                      </Section>
                      <Section title={t('event.form.sections.languages')}>
                        <LanguagesSection />
                      </Section>
                      <Section
                        title={t('event.form.sections.responsibilities')}
                      >
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
          </>
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
      include: EVENT_INCLUDES,
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
