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
  useDeleteEventMutation,
  useUpdateEventsMutation,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { reportError } from '../../app/sentry/utils';
import { authenticatedSelector } from '../../auth/selectors';
import { clearEventQuery } from '../../events/utils';
import useUser from '../../user/hooks/useUser';
import { EVENT_EDIT_ACTIONS } from '../constants';
import { EventFormFields } from '../types';
import {
  checkIsEditActionAllowed,
  getEventFields,
  getEventInitialValues,
  getEventPayload,
  getOrganizationAncestors,
  getRelatedEvents,
} from '../utils';
import useUpdateImageIfNeeded from './useUpdateImageIfNeeded';

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

  const [deleteEventMutation] = useDeleteEventMutation();
  const [updateEventsMutation] = useUpdateEventsMutation();
  const { updateImageIfNeeded } = useUpdateImageIfNeeded();

  const closeModal = () => {
    setOpenModal(null);
  };

  const updateEvents = async (payload: UpdateEventMutationInput[]) => {
    await updateEventsMutation({
      variables: {
        input: payload,
      },
    });
  };

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

      const basePayload = getEventPayload(values, publicationStatus);
      payload = [{ ...basePayload, id }];

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
