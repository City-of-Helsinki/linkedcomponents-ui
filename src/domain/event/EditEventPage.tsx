import { useApolloClient } from '@apollo/client';
import { Form, Formik } from 'formik';
import map from 'lodash/map';
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
  useDeleteEventMutation,
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
import useEventFieldOptionsData from './hooks/useEventFieldOptionsData';
import useRelatedEvents from './hooks/useRelatedEvents';
import Section from './layout/Section';
import ConfirmCancelModal from './modals/ConfirmCancelModal';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
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
  refetch: () => void;
}

enum MODALS {
  CANCEL = 'cancel',
  DELETE = 'delete',
  POSTPONE = 'postpone',
  UPDATE = 'update',
}

const EditEventPage: React.FC<EditEventPageProps> = ({ event, refetch }) => {
  const apolloClient = useApolloClient();
  const { t } = useTranslation();
  const history = useHistory();
  const locale = useLocale();
  const { atId, id, name, publicationStatus, superEventType } = getEventFields(
    event,
    locale
  );
  const [modal, setModal] = React.useState<MODALS | null>(null);
  const [saving, setSaving] = React.useState<MODALS | null>(null);
  const [nextPublicationStatus, setNextPublicationStatus] = React.useState(
    publicationStatus
  );

  const initialValues = React.useMemo(() => {
    return getEventInitialValues(event);
  }, [event]);

  const [deleteEventMutation] = useDeleteEventMutation();
  const [updateEventsMutation] = useUpdateEventsMutation();
  const [updateImage] = useUpdateImageMutation();
  // Prefetch all related events which are used when postpone/delete/cancel events
  useRelatedEvents(event);

  const goToEventsPage = () => {
    history.push(`/${locale}${ROUTES.EVENTS}`);
  };

  const saveImageIfNeeded = async (values: EventFormFields) => {
    const { imageDetails, images } = values;
    const imageId = images[0];

    /* istanbul ignore else */
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
  };

  const refetchEvent = () => {
    refetch();
  };

  const cancelEvent = async () => {
    try {
      setSaving(MODALS.CANCEL);
      // Make sure all related events are fetched
      const allEvents = await getRelatedEvents({ apolloClient, event });
      const payload: UpdateEventMutationInput[] = allEvents.map((item) => ({
        ...getEventPayload(
          getEventInitialValues(item),
          item.publicationStatus as PublicationStatus
        ),
        eventStatus: EventStatus.EventCancelled,
        superEventType: item.superEventType,
        id: item.id,
      }));

      await updateEvents(payload);
      await refetchEvent();
      window.scrollTo(0, 0);
      closeModal();
      setSaving(null);
    } catch (e) /* istanbul ignore next */ {
      // Network errors will be handled on apolloClient error link. Only show error on console here.
      // eslint-disable-next-line no-console
      console.error(e);
      setSaving(null);
    }
  };

  const deleteEvent = async () => {
    try {
      setSaving(MODALS.DELETE);
      // Make sure all related events are fetched
      const allEvents = await getRelatedEvents({ apolloClient, event });
      const allEventIds = map(allEvents, 'id');
      for (const id of allEventIds) {
        await deleteEventMutation({ variables: { id } });
      }

      // Clear all events queries from apollo cache to show edited events in event list
      clearEventsQueries(apolloClient);
      goToEventsPage();
      closeModal();
      setSaving(null);
    } catch (e) /* istanbul ignore next */ {
      // Network errors will be handled on apolloClient error link. Only show error on console here.
      // eslint-disable-next-line no-console
      console.error(e);
      setSaving(null);
    }
  };

  const postponeEvent = async () => {
    try {
      setSaving(MODALS.POSTPONE);
      // Make sure all related events are fetched
      const allEvents = await getRelatedEvents({ apolloClient, event });
      const payload: UpdateEventMutationInput[] = allEvents.map((item) => ({
        ...getEventPayload(
          getEventInitialValues(item),
          item.publicationStatus as PublicationStatus
        ),
        superEventType: item.superEventType,
        id: item.id,
        startTime: null,
        endTime: null,
      }));

      await updateEvents(payload);
      await refetchEvent();
      window.scrollTo(0, 0);
      closeModal();
      setSaving(null);
    } catch (e) /* istanbul ignore next */ {
      // Network errors will be handled on apolloClient error link. Only show error on console here.
      // eslint-disable-next-line no-console
      console.error(e);
      setSaving(null);
    }
  };

  const saveEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus
  ) => {
    try {
      setSaving(MODALS.UPDATE);
      const subEvents = event.subEvents;

      await saveImageIfNeeded(values);

      const basePayload = getEventPayload(values, publicationStatus);
      const payload: UpdateEventMutationInput[] = [{ ...basePayload, id }];

      if (superEventType === SuperEventType.Recurring) {
        payload[0].superEventType = SuperEventType.Recurring;
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
      await refetchEvent();
      window.scrollTo(0, 0);
      closeModal();
      setSaving(null);
    } catch (e) /* istanbul ignore next  */ {
      // Network errors will be handled on apolloClient error link. Only show error on console here.
      // eslint-disable-next-line no-console
      console.error(e);
      setSaving(null);
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
      enableReinitialize={true}
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
              isSaving={saving === MODALS.CANCEL}
              onCancel={cancelEvent}
              onClose={closeModal}
            />
            <ConfirmDeleteModal
              event={event}
              isOpen={modal === MODALS.DELETE}
              isSaving={saving === MODALS.DELETE}
              onDelete={deleteEvent}
              onClose={closeModal}
            />
            <ConfirmPostponeModal
              event={event}
              isOpen={modal === MODALS.POSTPONE}
              isSaving={saving === MODALS.POSTPONE}
              onClose={closeModal}
              onPostpone={postponeEvent}
            />
            <ConfirmUpdateModal
              event={event}
              isOpen={modal === MODALS.UPDATE}
              isSaving={saving === MODALS.UPDATE}
              onClose={closeModal}
              onSave={() => {
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
                    onDelete={() => setModal(MODALS.DELETE)}
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
  const { data: eventData, loading: loadingEvent, refetch } = useEventQuery({
    fetchPolicy: 'no-cache',
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id,
      include: EVENT_INCLUDES,
    },
  });

  // Load options for inLanguage, audience and keywords checkboxes
  const { loading: loadingEventFieldOptions } = useEventFieldOptionsData();

  const loading = loadingEvent || loadingEventFieldOptions;

  return (
    <LoadingSpinner isLoading={loading}>
      {eventData?.event ? (
        <EditEventPage event={eventData.event} refetch={refetch} />
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default EditEventPageWrapper;
