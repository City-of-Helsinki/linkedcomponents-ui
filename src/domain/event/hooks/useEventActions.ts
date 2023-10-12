/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApolloClient,
  FetchResult,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import map from 'lodash/map';
import { useTranslation } from 'react-i18next';

import {
  CreateEventMutationInput,
  CreateEventsMutation,
  EventFieldsFragment,
  EventStatus,
  PublicationStatus,
  SuperEventType,
  UpdateEventMutationInput,
  useCreateEventMutation,
  useCreateEventsMutation,
  useDeleteEventMutation,
  UserFieldsFragment,
  useUpdateEventsMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import useLocale from '../../../hooks/useLocale';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import { clearEventsQueries } from '../../app/apollo/clearCacheUtils';
import { useAuth } from '../../auth/hooks/useAuth';
import { getOrganizationAncestorsQueryResult } from '../../organization/utils';
import useUser from '../../user/hooks/useUser';
import { EVENT_ACTIONS, EVENT_MODALS } from '../constants';
import { EventFormFields } from '../types';
import {
  calculateSuperEventTime,
  checkIsActionAllowed,
  getEventBasePayload,
  getEventFields,
  getEventInitialValues,
  getEventPayload,
  getNewEventTimes,
  getRecurringEventPayload,
  getRelatedEvents,
  omitSensitiveDataFromEventPayload,
} from '../utils';
import useUpdateImageIfNeeded from './useUpdateImageIfNeeded';
import useUpdateRecurringEventIfNeeded from './useUpdateRecurringEventIfNeeded';
import { getEventCreateAction, getEventUpdateAction } from './utils';

type UseEventActionsState = {
  cancelEvent: (callbacks?: MutationCallbacks) => Promise<void>;
  closeModal: () => void;
  createEvent: (
    values: EventFormFields,
    publicationStatus: PublicationStatus,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  deleteEvent: (callbacks?: MutationCallbacks) => Promise<void>;
  openModal: EVENT_MODALS | null;
  postponeEvent: (callbacks?: MutationCallbacks) => Promise<void>;
  saving: EVENT_ACTIONS | null;
  setOpenModal: (modal: EVENT_MODALS | null) => void;
  updateEvent: (
    values: EventFormFields,
    publicationStatus: PublicationStatus,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  user: UserFieldsFragment | undefined;
};

const useEventActions = (
  event?: EventFieldsFragment | null
): UseEventActionsState => {
  const { t } = useTranslation();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const locale = useLocale();
  const [openModal, setOpenModal] = useMountedState<EVENT_MODALS | null>(null);
  const [saving, setSaving] = useMountedState<EVENT_ACTIONS | null>(null);

  const [createEventMutation] = useCreateEventMutation();
  const [createEventsMutation] = useCreateEventsMutation();
  const [deleteEventMutation] = useDeleteEventMutation();
  const [updateEventsMutation] = useUpdateEventsMutation();
  const { updateImageIfNeeded } = useUpdateImageIfNeeded();
  const { updateRecurringEventIfNeeded } = useUpdateRecurringEventIfNeeded();

  const closeModal = () => {
    setOpenModal(null);
  };

  const savingFinished = () => {
    setSaving(null);
  };

  const updateEvents = (payload: UpdateEventMutationInput[]) =>
    updateEventsMutation({ variables: { input: payload } });

  const getEditableEvents = async (
    events: EventFieldsFragment[],
    action: EVENT_ACTIONS
  ) => {
    const editableEvents: EventFieldsFragment[] = [];
    for (const item of events) {
      /* istanbul ignore next */
      const organizationAncestors = await getOrganizationAncestorsQueryResult(
        getValue(item.publisher, ''),
        apolloClient
      );
      const { editable } = checkIsActionAllowed({
        action,
        authenticated,
        event: item,
        organizationAncestors,
        t,
        user,
      });

      /* istanbul ignore else */
      if (editable) {
        editableEvents.push(item);
      }
    }

    return editableEvents;
  };

  const cleanAfterCreateOrUpdate = async ({
    callbacks,
    id,
  }: {
    callbacks?: MutationCallbacks;
    id?: string;
  }) => {
    /* istanbul ignore next */
    !isTestEnv && clearEventsQueries(apolloClient);

    savingFinished();
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess(id));
  };

  const { handleError } = useHandleError<
    | CreateEventMutationInput
    | CreateEventMutationInput[]
    | UpdateEventMutationInput[]
    | Record<string, unknown>,
    null
  >();

  const cancelEvent = async (callbacks?: MutationCallbacks) => {
    let payload: UpdateEventMutationInput[] = [];

    try {
      setSaving(EVENT_ACTIONS.CANCEL);
      // Check that user has permission to cancel events
      const allEvents = await getRelatedEvents({
        apolloClient,
        event: event as EventFieldsFragment,
      });
      const editableEvents = await getEditableEvents(
        allEvents,
        EVENT_ACTIONS.CANCEL
      );

      payload = editableEvents.map((item) => {
        const basePayload = getEventBasePayload(
          getEventInitialValues(item),
          item.publicationStatus as PublicationStatus
        );

        /* istanbul ignore next */
        return {
          ...basePayload,
          id: item.id,
          endTime: item.endTime,
          eventStatus: EventStatus.EventCancelled,
          startTime: item.startTime,
          superEvent: item.superEvent ? { atId: item.superEvent.atId } : null,
          superEventType: item.superEventType,
        };
      });

      await updateEvents(payload);
      await updateRecurringEventIfNeeded(event as EventFieldsFragment);

      await cleanAfterCreateOrUpdate({ callbacks });
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        payload: payload.map((data) => omitSensitiveDataFromEventPayload(data)),
        message: 'Failed to cancel event',
        savingFinished,
      });
    }
  };

  const createRecurringEvent = async (
    payload: CreateEventMutationInput[],
    values: EventFormFields,
    callbacks?: MutationCallbacks
  ) => {
    let eventsData: FetchResult<CreateEventsMutation> | null = null;

    // Save sub-events
    try {
      eventsData = await createEventsMutation({
        variables: { input: payload },
      });
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        payload,
        message: 'Failed to create sub-events in recurring event creation',
        savingFinished,
      });

      // Don't save recurring event if sub-event creation fails
      return;
    }

    /* istanbul ignore next */
    const subEventIds = getValue(
      eventsData?.data?.createEvents.map((item) => item.atId),
      []
    );
    const recurringEventPayload = getRecurringEventPayload(
      payload,
      subEventIds,
      values
    );

    try {
      const recurringEventData = await createEventMutation({
        variables: { input: recurringEventPayload },
      });

      return getValue(recurringEventData.data?.createEvent.id, '');
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        payload: omitSensitiveDataFromEventPayload(recurringEventPayload),
        message: 'Failed to create recurring event',
        savingFinished,
      });
    }
  };

  const createSingleEvent = async (
    payload: CreateEventMutationInput,
    callbacks?: MutationCallbacks
  ) => {
    try {
      const data = await createEventMutation({
        variables: { input: payload },
      });

      return getValue(data.data?.createEvent.id, '');
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        payload: omitSensitiveDataFromEventPayload(payload),
        message: 'Failed to create event',
        savingFinished,
      });
    }
  };

  const createEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(getEventCreateAction(publicationStatus));
    try {
      await updateImageIfNeeded(values);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        error,
        message: 'Failed to update image',
        payload: { images: values.images, imageDetails: values.imageDetails },
        savingFinished,
      });
    }

    const payload = getEventPayload(values, publicationStatus);
    let createdEventId: string | undefined;

    if (Array.isArray(payload)) {
      createdEventId = await createRecurringEvent(payload, values, callbacks);
    } else {
      createdEventId = await createSingleEvent(payload, callbacks);
    }

    if (createdEventId) {
      cleanAfterCreateOrUpdate({ id: createdEventId, callbacks });
    }
  };

  const deleteEvent = async (callbacks?: MutationCallbacks) => {
    let deletableEventIds: string[] = [];
    try {
      setSaving(EVENT_ACTIONS.DELETE);
      // Check that user has permission to delete events
      const allEvents = await getRelatedEvents({
        apolloClient,
        event: event as EventFieldsFragment,
      });
      const deletableEvents = await getEditableEvents(
        allEvents,
        EVENT_ACTIONS.DELETE
      );
      deletableEventIds = map(deletableEvents, 'id');

      for (const id of deletableEventIds) {
        await deleteEventMutation({ variables: { id } });
      }

      await updateRecurringEventIfNeeded(event as EventFieldsFragment);

      await cleanAfterCreateOrUpdate({ callbacks });
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,

        error,
        message: 'Failed to delete event',
        payload: { eventIds: deletableEventIds },
        savingFinished,
      });
    }
  };

  const postponeEvent = async (callbacks?: MutationCallbacks) => {
    let payload: UpdateEventMutationInput[] = [];
    try {
      setSaving(EVENT_ACTIONS.POSTPONE);

      // Check that user has permission to postpone events
      const allEvents = await getRelatedEvents({
        apolloClient,
        event: event as EventFieldsFragment,
      });

      const editableEvents = await getEditableEvents(
        allEvents,
        EVENT_ACTIONS.POSTPONE
      );

      payload = editableEvents.map((item) => {
        const basePayload = getEventBasePayload(
          getEventInitialValues(item),
          item.publicationStatus as PublicationStatus
        );

        /* istanbul ignore next */
        return {
          ...basePayload,
          id: item.id,
          endTime: null,
          startTime: null,
          superEvent: item.superEvent ? { atId: item.superEvent.atId } : null,
          superEventType: item.superEventType,
        };
      });

      await updateEvents(payload);
      await updateRecurringEventIfNeeded(event as EventFieldsFragment);

      await cleanAfterCreateOrUpdate({ callbacks });
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to postpone event',
        payload: payload.map((data) => omitSensitiveDataFromEventPayload(data)),
        savingFinished,
      });
    }
  };

  const updateRecurringEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus,
    callbacks?: MutationCallbacks
  ) => {
    let payload: UpdateEventMutationInput[] = [];

    try {
      const { atId, id } = getEventFields(event as EventFieldsFragment, locale);

      const action = getEventUpdateAction(
        event as EventFieldsFragment,
        publicationStatus
      );
      const basePayload = getEventBasePayload(values, publicationStatus);

      /* istanbul ignore next */
      const subEvents = getValue(event?.subEvents, []) as EventFieldsFragment[];
      const editableSubEvents = await getEditableEvents(subEvents, action);

      const subEventIds: string[] = [];

      // Delete sub-events
      const eventsToDelete = editableSubEvents
        .filter(
          (subEvent) =>
            !values.events.map((event) => event.id).includes(subEvent.id)
        )
        .map((event) => event.id);

      for (const id of eventsToDelete) {
        await deleteEventMutation({ variables: { id } });
      }

      // Add all not deleted sub-event ids to subEventIds
      subEventIds.push(
        ...subEvents
          .filter((subEvent) => !eventsToDelete.includes(subEvent.id))
          .map((item) => item.atId)
      );

      // Update existing sub-events
      const subEventsPayload: UpdateEventMutationInput[] = editableSubEvents
        .filter((subEvent) => !eventsToDelete.includes(subEvent.id))
        .map((subEvent) => {
          const eventTime = values.events.find(
            (eventTime) => eventTime.id === subEvent.id
          );

          /* istanbul ignore next */
          return {
            ...basePayload,
            endTime: getValue(eventTime?.endTime?.toISOString(), null),
            id: subEvent?.id,
            startTime: getValue(eventTime?.startTime?.toISOString(), null),
            superEvent: { atId },
            superEventType: subEvent?.superEventType,
          };
        });

      /* istanbul ignore else */
      if (subEventsPayload.length) {
        await updateEvents(subEventsPayload);
      }
      // Create new sub-events
      const newEventTimes = getNewEventTimes(
        values.eventTimes,
        values.recurringEvents
      );

      /* istanbul ignore else */
      if (newEventTimes.length) {
        const newSubEventsPayload = newEventTimes.map(
          /* istanbul ignore next */ (eventTime) => ({
            ...basePayload,
            endTime: getValue(eventTime?.endTime?.toISOString(), null),
            startTime: getValue(eventTime?.startTime?.toISOString(), null),
            superEvent: { atId },
            superEventType: null,
          })
        );
        const newSubEventsData = await createEventsMutation({
          variables: { input: newSubEventsPayload },
        });
        /* istanbul ignore else */
        if (newSubEventsData.data?.createEvents.length) {
          subEventIds.push(
            ...newSubEventsData.data.createEvents.map((item) => item.atId)
          );
        }
      }
      // Get payload to update recurring event
      const superEventTime = calculateSuperEventTime([
        ...values.events,
        ...newEventTimes,
      ]);

      /* istanbul ignore next */
      payload = [
        {
          ...basePayload,
          endTime: getValue(superEventTime.endTime?.toISOString(), null),
          id,
          superEvent:
            values.hasUmbrella && values.superEvent
              ? { atId: values.superEvent }
              : null,
          startTime: getValue(superEventTime.startTime?.toISOString(), null),
          subEvents: subEventIds.map((atId) => ({ atId: atId })),
          superEventType: SuperEventType.Recurring,
        },
      ];

      await updateEvents(payload);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update recurring event',
        payload: payload.map((data) => omitSensitiveDataFromEventPayload(data)),
        savingFinished,
      });
    }
  };

  const updateEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus,
    callbacks?: MutationCallbacks
  ) => {
    let payload: UpdateEventMutationInput[] = [];

    try {
      await updateImageIfNeeded(values);
    } catch (error: any) /* istanbul ignore next */ {
      // Report error to Sentry
      handleError({
        callbacks,
        error,
        message: 'Failed to update event',
        payload,
        savingFinished:
          /* istanbul ignore next */
          () => undefined,
      });
    }

    try {
      const action = getEventUpdateAction(
        event as EventFieldsFragment,
        publicationStatus
      );
      setSaving(action);

      const { id, superEventType } = getEventFields(
        event as EventFieldsFragment,
        locale
      );

      if (superEventType === SuperEventType.Recurring) {
        await updateRecurringEvent(values, publicationStatus, callbacks);
      } else {
        // Update single event
        const basePayload = getEventBasePayload(values, publicationStatus);

        if (event?.superEvent?.superEventType === SuperEventType.Recurring) {
          basePayload.superEvent = { atId: event.superEvent.atId };
        }

        /* istanbul ignore next */
        payload = [
          {
            ...basePayload,
            endTime: getValue(values.events[0]?.endTime?.toISOString(), null),
            id,
            startTime: getValue(
              values.events[0]?.startTime?.toISOString(),
              null
            ),
          },
        ];

        await updateEvents(payload);
        await updateRecurringEventIfNeeded(event as EventFieldsFragment);
      }

      await cleanAfterCreateOrUpdate({ callbacks });
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update event',
        payload: payload.map((data) => omitSensitiveDataFromEventPayload(data)),
        savingFinished,
      });
    }
  };

  return {
    cancelEvent,
    closeModal,
    createEvent,
    deleteEvent,
    openModal,
    postponeEvent,
    saving,
    setOpenModal,
    updateEvent,
    user,
  };
};

export default useEventActions;
