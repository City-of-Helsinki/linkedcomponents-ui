import { useApolloClient } from '@apollo/client';
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
import useLocale from '../../../hooks/useLocale';
import { reportError } from '../../app/sentry/utils';
import { authenticatedSelector } from '../../auth/selectors';
import { clearEventQuery, clearEventsQueries } from '../../events/utils';
import useUser from '../../user/hooks/useUser';
import { EVENT_EDIT_ACTIONS } from '../constants';
import { EventFormFields, EventTime } from '../types';
import {
  calculateSuperEventTime,
  checkIsEditActionAllowed,
  getEventFields,
  getEventInitialValues,
  getEventPayload,
  getOrganizationAncestors,
  getRelatedEvents,
} from '../utils';
import useUpdateImageIfNeeded from './useUpdateImageIfNeeded';
import useUpdateRecurringEventIfNeeded from './useUpdateRecurringEventIfNeeded';

export enum MODALS {
  CANCEL = 'cancel',
  DELETE = 'delete',
  POSTPONE = 'postpone',
  UPDATE = 'update',
}

interface Callbacks {
  onError?: () => void;
  onSuccess?: () => void;
}

interface Props {
  event: EventFieldsFragment;
}

const useEventUpdateActions = ({ event }: Props) => {
  const { t } = useTranslation();
  const apolloClient = useApolloClient();
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const locale = useLocale();
  const location = useLocation();
  const [openModal, setOpenModal] = React.useState<MODALS | null>(null);
  const [saving, setSaving] = React.useState<MODALS | null>(null);

  const [createEventsMutation] = useCreateEventsMutation();
  const [deleteEventMutation] = useDeleteEventMutation();
  const [updateEventsMutation] = useUpdateEventsMutation();
  const { updateImageIfNeeded } = useUpdateImageIfNeeded();
  const { updateRecurringEventIfNeeded } = useUpdateRecurringEventIfNeeded();

  const closeModal = () => {
    setOpenModal(null);
  };

  const updateEvents = (payload: UpdateEventMutationInput[]) =>
    updateEventsMutation({
      variables: {
        input: payload,
      },
    });

  const getEditableEvents = async (
    events: EventFieldsFragment[],
    action: EVENT_EDIT_ACTIONS
  ) => {
    const editableEvents: EventFieldsFragment[] = [];
    for (event of events) {
      const organizationAncestors = await getOrganizationAncestors({
        event,
        apolloClient,
      });
      const { editable } = checkIsEditActionAllowed({
        action,
        authenticated,
        event,
        organizationAncestors,
        t,
        user,
      });

      if (editable) {
        editableEvents.push(event);
      }
    }

    return editableEvents;
  };

  const cancelEvent = async (callbacks?: Callbacks) => {
    let payload: UpdateEventMutationInput[] = [];
    try {
      setSaving(MODALS.CANCEL);
      // Check that user has permission to cancel events
      const allEvents = await getRelatedEvents({ apolloClient, event });
      const editableEvents = await getEditableEvents(
        allEvents,
        EVENT_EDIT_ACTIONS.CANCEL
      );

      payload = editableEvents.map((item) => ({
        ...getEventPayload(
          getEventInitialValues(item),
          item.publicationStatus as PublicationStatus
        ),
        eventStatus: EventStatus.EventCancelled,
        superEventType: item.superEventType,
        id: item.id,
      }));

      await updateEvents(payload);
      await updateRecurringEventIfNeeded(event);

      // Call callback function if defined
      await (callbacks?.onSuccess && callbacks.onSuccess());

      closeModal();
      setSaving(null);
    } catch (error) /* istanbul ignore next */ {
      setSaving(null);
      // Report error to Sentry
      reportError({
        data: {
          error,
          event,
          eventAsString: JSON.stringify(event),
          payload,
          payloadAsString: JSON.stringify(payload),
        },
        location,
        message: 'Failed to cancel event',
        user,
      });
      // Call callback function if defined
      await (callbacks?.onError && callbacks.onError());
    }
  };

  const deleteEvent = async (callbacks?: Callbacks) => {
    let deletableEventIds: string[] = [];
    try {
      setSaving(MODALS.DELETE);
      // Check that user has permission to delete events
      const allEvents = await getRelatedEvents({ apolloClient, event });
      const deletableEvents = await getEditableEvents(
        allEvents,
        EVENT_EDIT_ACTIONS.CANCEL
      );
      deletableEventIds = map(deletableEvents, 'id');

      for (const id of deletableEventIds) {
        await deleteEventMutation({ variables: { id } });
      }

      await updateRecurringEventIfNeeded(event);
      // Clear all events from apollo cache
      for (const id of deletableEventIds) {
        clearEventQuery(apolloClient, id);
      }

      // Call callback function if defined
      await (callbacks?.onSuccess && callbacks.onSuccess());

      closeModal();
      setSaving(null);
    } catch (error) /* istanbul ignore next */ {
      setSaving(null);
      // Report error to Sentry
      reportError({
        data: {
          error,
          event,
          eventAsString: JSON.stringify(event),
          eventIds: deletableEventIds,
        },
        location,
        message: 'Failed to delete event',
        user,
      });
      // Call callback function if defined
      await (callbacks?.onError && callbacks.onError());
    }
  };

  const postponeEvent = async (callbacks?: Callbacks) => {
    let payload: UpdateEventMutationInput[] = [];
    try {
      setSaving(MODALS.POSTPONE);
      // Check that user has permission to postpone events
      const allEvents = await getRelatedEvents({ apolloClient, event });
      const editableEvents = await getEditableEvents(
        allEvents,
        EVENT_EDIT_ACTIONS.CANCEL
      );

      payload = editableEvents.map((item) => ({
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
      await updateRecurringEventIfNeeded(event);

      // Call callback function if defined
      await (callbacks?.onSuccess && callbacks.onSuccess());

      closeModal();
      setSaving(null);
    } catch (error) /* istanbul ignore next */ {
      setSaving(null);
      // Report error to Sentry
      reportError({
        data: {
          error,
          event,
          eventAsString: JSON.stringify(event),
          payload,
          payloadAsString: JSON.stringify(payload),
        },
        location,
        message: 'Failed to cancel event',
        user,
      });
      // Call callback function if defined
      await (callbacks?.onError && callbacks.onError());
    }
  };

  const updateEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus,
    callbacks?: Callbacks
  ) => {
    let payload: UpdateEventMutationInput[] = [];
    try {
      setSaving(MODALS.UPDATE);
      const { atId, id, superEventType } = getEventFields(event, locale);
      // Check that user has permission to update sub-events
      const subEvents = await getEditableEvents(
        (event.subEvents || []) as EventFieldsFragment[],
        publicationStatus === PublicationStatus.Draft
          ? EVENT_EDIT_ACTIONS.UPDATE_DRAFT
          : EVENT_EDIT_ACTIONS.UPDATE_PUBLIC
      );

      await updateImageIfNeeded(values);

      const basePayload = getEventPayload(
        {
          ...values,
          events: [],
          eventTimes:
            superEventType === SuperEventType.Recurring
              ? []
              : [values.events[0]].filter((e) => e),
          recurringEvents: [],
        },
        publicationStatus
      );

      if (superEventType === SuperEventType.Recurring) {
        const subEventIds: string[] = [];

        // Delete sub-events
        const eventsToDelete = subEvents
          .filter(
            (subEvent) =>
              !values.events.map((event) => event.id).includes(subEvent.id)
          )
          .map((event) => event.id);

        for (const id of eventsToDelete) {
          await deleteEventMutation({ variables: { id } });
        }

        // Update existing sub-events
        const subEventsPayload: UpdateEventMutationInput[] = subEvents
          .filter((subEvent) => !eventsToDelete.includes(subEvent.id))
          .map((subEvent) => {
            const eventTime = values.events.find(
              (eventTime) => eventTime.id === subEvent.id
            );
            return {
              ...basePayload,
              id: subEvent?.id as string,
              startTime: eventTime?.startTime?.toISOString() ?? null,
              endTime: eventTime?.endTime?.toISOString() ?? null,
              superEvent: { atId },
              superEventType: subEvent?.superEventType,
            };
          });

        if (subEventsPayload.length) {
          const subEventsData = await updateEvents(subEventsPayload);

          if (subEventsData.data?.updateEvents.length) {
            subEventIds.push(
              ...subEventsData.data?.updateEvents.map(
                (item) => item.atId as string
              )
            );
          }
        }

        // Create new sub-events
        const newEventTimes: EventTime[] = [...values.eventTimes];
        values.recurringEvents.forEach((recurringEvent) => {
          newEventTimes.push(...recurringEvent.eventTimes);
        });

        if (newEventTimes.length) {
          const newSubEventsPayload = newEventTimes.map((eventTime) => {
            return {
              ...basePayload,
              startTime: eventTime?.startTime?.toISOString() ?? null,
              endTime: eventTime?.endTime?.toISOString() ?? null,
              superEvent: { atId },
              superEventType: null,
            };
          });

          const newSubEventsData = await createEventsMutation({
            variables: { input: newSubEventsPayload },
          });

          if (newSubEventsData.data?.createEvents.length) {
            subEventIds.push(
              ...newSubEventsData.data.createEvents.map(
                (item) => item.atId as string
              )
            );
          }
        }

        // Get payload to update recurring event
        const superEventTime = calculateSuperEventTime([
          ...values.events,
          ...newEventTimes,
        ]);

        payload = [
          {
            ...basePayload,
            endTime: superEventTime.endTime?.toISOString(),
            id,
            startTime: superEventTime.startTime?.toISOString(),
            subEvents: subEventIds.map((atId) => ({ atId: atId })),
            superEventType: SuperEventType.Recurring,
          },
        ];
        await updateEvents(payload);
        clearEventsQueries(apolloClient);
      } else {
        payload = [{ ...basePayload, id }];
        await updateEvents(payload);
        await updateRecurringEventIfNeeded(event);
      }

      // Call callback function if defined
      await (callbacks?.onSuccess && callbacks.onSuccess());

      closeModal();
      setSaving(null);
    } catch (error) /* istanbul ignore next */ {
      setSaving(null);
      // Report error to Sentry
      reportError({
        data: {
          error,
          event,
          eventAsString: JSON.stringify(event),
          payload,
          payloadAsString: JSON.stringify(payload),
        },
        location,
        message: 'Failed to update event',
        user,
      });
      // Call callback function if defined
      await (callbacks?.onError && callbacks.onError());
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
