import { ApolloClient, InMemoryCache, useApolloClient } from '@apollo/client';
import map from 'lodash/map';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import {
  EventFieldsFragment,
  EventStatus,
  PublicationStatus,
  SuperEventType,
  UpdateEventMutationInput,
  useCreateEventsMutation,
  useDeleteEventMutation,
  useUpdateEventsMutation,
} from '../../../generated/graphql';
import useIsMounted from '../../../hooks/useIsMounted';
import useLocale from '../../../hooks/useLocale';
import isTestEnv from '../../../utils/isTestEnv';
import { reportError } from '../../app/sentry/utils';
import { authenticatedSelector } from '../../auth/selectors';
import { clearEventsQueries } from '../../events/utils';
import useUser from '../../user/hooks/useUser';
import { EVENT_EDIT_ACTIONS } from '../constants';
import { EventFormFields } from '../types';
import {
  calculateSuperEventTime,
  checkIsEditActionAllowed,
  getEventBasePayload,
  getEventFields,
  getEventInitialValues,
  getNewEventTimes,
  getOrganizationAncestors,
  getRelatedEvents,
} from '../utils';
import useUpdateImageIfNeeded from './useUpdateImageIfNeeded';
import useUpdateRecurringEventIfNeeded from './useUpdateRecurringEventIfNeeded';
import { getEventUpdateAction } from './utils';

export enum MODALS {
  CANCEL = 'cancel',
  DELETE = 'delete',
  POSTPONE = 'postpone',
  UPDATE = 'update',
}

interface Callbacks {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
  onSuccess?: () => void;
}

interface Props {
  event: EventFieldsFragment;
}

type UseEventUpdateActionsState = {
  cancelEvent: (callbacks?: Callbacks) => Promise<void>;
  closeModal: () => void;
  deleteEvent: (callbacks?: Callbacks) => Promise<void>;
  openModal: MODALS | null;
  postponeEvent: (callbacks?: Callbacks) => Promise<void>;
  saving: EVENT_EDIT_ACTIONS | false;
  setOpenModal: (modal: MODALS | null) => void;
  updateEvent: (
    values: EventFormFields,
    publicationStatus: PublicationStatus,
    callbacks?: Callbacks
  ) => Promise<void>;
};
const useEventUpdateActions = ({
  event,
}: Props): UseEventUpdateActionsState => {
  const isMounted = useIsMounted();
  const { t } = useTranslation();
  const apolloClient = useApolloClient() as ApolloClient<InMemoryCache>;
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const locale = useLocale();
  const location = useLocation();
  const [openModal, setOpenModal] = React.useState<MODALS | null>(null);
  const [saving, setSaving] = React.useState<EVENT_EDIT_ACTIONS | false>(false);

  const [createEventsMutation] = useCreateEventsMutation();
  const [deleteEventMutation] = useDeleteEventMutation();
  const [updateEventsMutation] = useUpdateEventsMutation();
  const { updateImageIfNeeded } = useUpdateImageIfNeeded();
  const { updateRecurringEventIfNeeded } = useUpdateRecurringEventIfNeeded();

  const closeModal = () => {
    /* istanbul ignore else */
    if (isMounted.current) {
      setOpenModal(null);
    }
  };
  const savingFinished = () => {
    /* istanbul ignore else */
    if (isMounted.current) {
      setSaving(false);
    }
  };

  const updateEvents = (payload: UpdateEventMutationInput[]) =>
    updateEventsMutation({ variables: { input: payload } });

  const getEditableEvents = async (
    events: EventFieldsFragment[],
    action: EVENT_EDIT_ACTIONS
  ) => {
    const editableEvents: EventFieldsFragment[] = [];
    for (const item of events) {
      const organizationAncestors = await getOrganizationAncestors({
        event,
        apolloClient,
      });
      const { editable } = checkIsEditActionAllowed({
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

  const cleanAfterUpdate = async (callbacks?: Callbacks) => {
    /* istanbul ignore next */
    !isTestEnv && clearEventsQueries(apolloClient);

    savingFinished();
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess());
  };

  const handleError = ({
    callbacks,
    error,
    eventIds,
    message,
    payload,
  }: {
    callbacks?: Callbacks;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    eventIds?: string[];
    message: string;
    payload?: UpdateEventMutationInput[];
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        event,
        eventIds,
        payloadAsString: payload && JSON.stringify(payload),
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const cancelEvent = async (callbacks?: Callbacks) => {
    let payload: UpdateEventMutationInput[] = [];
    try {
      setSaving(EVENT_EDIT_ACTIONS.CANCEL);
      // Check that user has permission to cancel events
      const allEvents = await getRelatedEvents({ apolloClient, event });
      const editableEvents = await getEditableEvents(
        allEvents,
        EVENT_EDIT_ACTIONS.CANCEL
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
      await updateRecurringEventIfNeeded(event);

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        payload,
        message: 'Failed to cancel event',
      });
    }
  };

  const deleteEvent = async (callbacks?: Callbacks) => {
    let deletableEventIds: string[] = [];
    try {
      setSaving(EVENT_EDIT_ACTIONS.DELETE);
      // Check that user has permission to delete events
      const allEvents = await getRelatedEvents({ apolloClient, event });
      const deletableEvents = await getEditableEvents(
        allEvents,
        EVENT_EDIT_ACTIONS.DELETE
      );
      deletableEventIds = map(deletableEvents, 'id');

      for (const id of deletableEventIds) {
        await deleteEventMutation({ variables: { id } });
      }

      await updateRecurringEventIfNeeded(event);

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        eventIds: deletableEventIds,
        message: 'Failed to delete event',
      });
    }
  };

  const postponeEvent = async (callbacks?: Callbacks) => {
    let payload: UpdateEventMutationInput[] = [];
    try {
      setSaving(EVENT_EDIT_ACTIONS.POSTPONE);

      // Check that user has permission to postpone events
      const allEvents = await getRelatedEvents({
        apolloClient,
        event,
      });

      const editableEvents = await getEditableEvents(
        allEvents,
        EVENT_EDIT_ACTIONS.POSTPONE
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
      await updateRecurringEventIfNeeded(event);

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to postpone event',
        payload,
      });
    }
  };

  const updateRecurringEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus,
    callbacks?: Callbacks
  ) => {
    let payload: UpdateEventMutationInput[] = [];

    try {
      const { atId, id } = getEventFields(event, locale);

      const action = getEventUpdateAction(event, publicationStatus);
      const basePayload = getEventBasePayload(values, publicationStatus);

      /* istanbul ignore next */
      const subEvents = (event.subEvents || []) as EventFieldsFragment[];
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
            endTime: eventTime?.endTime?.toISOString() ?? null,
            id: subEvent?.id as string,
            startTime: eventTime?.startTime?.toISOString() ?? null,
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
            endTime: eventTime?.endTime?.toISOString() ?? null,
            startTime: eventTime?.startTime?.toISOString() ?? null,
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
          endTime: superEventTime.endTime?.toISOString() ?? null,
          id,
          superEvent:
            values.hasUmbrella && values.superEvent
              ? { atId: values.superEvent }
              : null,
          startTime: superEventTime.startTime?.toISOString() ?? null,
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
        payload,
      });
    }
  };

  const updateEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus,
    callbacks?: Callbacks
  ) => {
    let payload: UpdateEventMutationInput[] = [];

    try {
      await updateImageIfNeeded(values);

      const action = getEventUpdateAction(event, publicationStatus);
      setSaving(action);

      const { id, superEventType } = getEventFields(event, locale);

      if (superEventType === SuperEventType.Recurring) {
        await updateRecurringEvent(values, publicationStatus, callbacks);
      } else {
        // Update single event
        const basePayload = getEventBasePayload(values, publicationStatus);
        /* istanbul ignore next */
        payload = [
          {
            ...basePayload,
            endTime: values.events[0]?.endTime?.toISOString() ?? null,
            id,
            startTime: values.events[0]?.startTime?.toISOString() ?? null,
          },
        ];

        await updateEvents(payload);
        await updateRecurringEventIfNeeded(event);
      }

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update event',
        payload,
      });
    }
  };

  return {
    cancelEvent,
    closeModal,
    deleteEvent,
    openModal,
    postponeEvent,
    saving,
    setOpenModal,
    updateEvent,
  };
};

export default useEventUpdateActions;
