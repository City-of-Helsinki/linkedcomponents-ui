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
  getEventFields,
  getEventInitialValues,
  getEventPayload,
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
  onError?: () => void;
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

      /* istanbul ignore else */
      if (editable) {
        // ignore sub-events to prevent getEventPayload to return array as result
        editableEvents.push({ ...event, subEvents: [] });
      }
    }

    return editableEvents;
  };

  const cancelEvent = async (callbacks?: Callbacks) => {
    let payload: UpdateEventMutationInput[] = [];
    try {
      setSaving(EVENT_EDIT_ACTIONS.CANCEL);
      // Check that user has permission to cancel events
      const allEvents = await getRelatedEvents({
        apolloClient,
        event,
      });
      const editableEvents = await getEditableEvents(
        allEvents,
        EVENT_EDIT_ACTIONS.CANCEL
      );

      payload = editableEvents.map((item) => {
        return {
          ...getEventPayload(
            getEventInitialValues(item),
            item.publicationStatus as PublicationStatus
          ),
          eventStatus: EventStatus.EventCancelled,
          superEventType: item.superEventType,
          id: item.id,
        };
      });

      await updateEvents(payload);
      await updateRecurringEventIfNeeded(event);

      /* istanbul ignore next */
      !isTestEnv && clearEventsQueries(apolloClient);

      savingFinished();
      closeModal();
      // Call callback function if defined
      await (callbacks?.onSuccess && callbacks.onSuccess());
    } catch (error) /* istanbul ignore next */ {
      savingFinished();
      // Report error to Sentry
      reportError({
        data: {
          error,
          event,
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
      setSaving(EVENT_EDIT_ACTIONS.DELETE);
      // Check that user has permission to delete events
      const allEvents = await getRelatedEvents({
        apolloClient,
        event,
      });
      const deletableEvents = await getEditableEvents(
        allEvents,
        EVENT_EDIT_ACTIONS.DELETE
      );
      deletableEventIds = map(deletableEvents, 'id');

      for (const id of deletableEventIds) {
        await deleteEventMutation({ variables: { id } });
      }

      await updateRecurringEventIfNeeded(event);

      /* istanbul ignore next */
      !isTestEnv && clearEventsQueries(apolloClient);

      savingFinished();
      closeModal();
      // Call callback function if defined
      await (callbacks?.onSuccess && callbacks.onSuccess());
    } catch (error) /* istanbul ignore next */ {
      savingFinished();
      // Report error to Sentry
      reportError({
        data: {
          error,
          event,
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

      /* istanbul ignore next */
      !isTestEnv && clearEventsQueries(apolloClient);

      savingFinished();
      closeModal();
      // Call callback function if defined
      await (callbacks?.onSuccess && callbacks.onSuccess());
    } catch (error) /* istanbul ignore next */ {
      savingFinished();
      // Report error to Sentry
      reportError({
        data: {
          error,
          event,
          payloadAsString: JSON.stringify(payload),
        },
        location,
        message: 'Failed to postpone event',
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
      const action = getEventUpdateAction(event, publicationStatus);

      setSaving(action);
      const { atId, id, superEventType } = getEventFields(event, locale);
      // Check that user has permission to update sub-events
      const subEvents = await getEditableEvents(
        (event.subEvents ||
          /* istanbul ignore next */ []) as EventFieldsFragment[],
        action
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
              startTime:
                eventTime?.startTime?.toISOString() ??
                /* istanbul ignore next */ null,
              endTime:
                eventTime?.endTime?.toISOString() ??
                /* istanbul ignore next */ null,
              superEvent: { atId },
              superEventType: subEvent?.superEventType,
            };
          });

        /* istanbul ignore else */
        if (subEventsPayload.length) {
          const subEventsData = await updateEvents(subEventsPayload);

          /* istanbul ignore else */
          if (subEventsData.data?.updateEvents.length) {
            subEventIds.push(
              ...subEventsData.data?.updateEvents.map(
                (item) => item.atId as string
              )
            );
          }
        }

        // Create new sub-events
        const newEventTimes = getNewEventTimes(
          values.eventTimes,
          values.recurringEvents
        );

        /* istanbul ignore else */
        if (newEventTimes.length) {
          const newSubEventsPayload = newEventTimes.map((eventTime) => {
            return {
              ...basePayload,
              startTime:
                eventTime?.startTime?.toISOString() ??
                /* istanbul ignore next */ null,
              endTime:
                eventTime?.endTime?.toISOString() ??
                /* istanbul ignore next */ null,
              superEvent: { atId },
              superEventType: null,
            };
          });

          const newSubEventsData = await createEventsMutation({
            variables: { input: newSubEventsPayload },
          });

          /* istanbul ignore else */
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
        /* istanbul ignore next */
        !isTestEnv && clearEventsQueries(apolloClient);
      } else {
        payload = [{ ...basePayload, id }];
        await updateEvents(payload);

        await updateRecurringEventIfNeeded(event);
        /* istanbul ignore next */
        !isTestEnv && clearEventsQueries(apolloClient);
      }

      savingFinished();
      closeModal();
      // Call callback function if defined
      await (callbacks?.onSuccess && callbacks.onSuccess());
    } catch (error) /* istanbul ignore next */ {
      savingFinished();
      // Report error to Sentry
      reportError({
        data: {
          error,
          event,
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
