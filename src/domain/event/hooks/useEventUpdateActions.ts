import { useApolloClient } from '@apollo/client';
import flatMap from 'lodash/flatMap';
import React from 'react';

import {
  EventFieldsFragment,
  EventStatus,
  PublicationStatus,
  SuperEventType,
  UpdateEventMutationInput,
  useDeleteEventMutation,
  useUpdateEventsMutation,
  useUpdateImageMutation,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import { clearEventsQueries, resetEventListPage } from '../../events/utils';
import { EventFormFields } from '../types';
import {
  getEventFields,
  getEventInitialValues,
  getEventPayload,
  getRelatedEvents,
} from '../utils';

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
  const apolloClient = useApolloClient();
  const locale = useLocale();
  const [openModal, setOpenModal] = React.useState<MODALS | null>(null);
  const [saving, setSaving] = React.useState<MODALS | null>(null);

  const [deleteEventMutation] = useDeleteEventMutation();
  const [updateEventsMutation] = useUpdateEventsMutation();
  const [updateImageMutation] = useUpdateImageMutation();

  const closeModal = () => {
    setOpenModal(null);
  };

  const updateEvents = async (payload: UpdateEventMutationInput[]) => {
    await updateEventsMutation({
      variables: {
        input: payload,
      },
    });

    // Clear all events queries from apollo cache to show edited events in event list
    clearEventsQueries(apolloClient);
    // This action will change LE response so clear event list page
    resetEventListPage();
  };

  const cancelEvent = async ({ onError, onSuccess }: Callbacks) => {
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

      // Call callback function if defined
      /* istanbul ignore else */
      if (onSuccess) {
        await onSuccess();
      }
      closeModal();
      setSaving(null);
    } catch (e) /* istanbul ignore next */ {
      setSaving(null);
      // Call callback function if defined
      if (onError) {
        onError();
      }
    }
  };

  const deleteEvent = async ({ onError, onSuccess }: Callbacks) => {
    try {
      setSaving(MODALS.DELETE);
      // Make sure all related events are fetched
      const allEvents = await getRelatedEvents({ apolloClient, event });
      const allEventIds = flatMap(allEvents, 'id');
      for (const id of allEventIds) {
        await deleteEventMutation({ variables: { id } });
      }

      // Clear all events queries from apollo cache to show edited events in event list
      clearEventsQueries(apolloClient);

      // Call callback function if defined
      /* istanbul ignore else */
      if (onSuccess) {
        await onSuccess();
      }
      closeModal();
      setSaving(null);
    } catch (e) /* istanbul ignore next */ {
      setSaving(null);
      // Call callback function if defined
      if (onError) {
        onError();
      }
    }
  };

  const postponeEvent = async ({ onError, onSuccess }: Callbacks) => {
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

      // Call callback function if defined
      /* istanbul ignore else */
      if (onSuccess) {
        await onSuccess();
      }
      closeModal();
      setSaving(null);
    } catch (e) /* istanbul ignore next */ {
      setSaving(null);
      // Call callback function if defined
      if (onError) {
        onError();
      }
    }
  };

  const saveImageIfNeeded = async (values: EventFormFields) => {
    const { imageDetails, images } = values;
    const imageId = images[0];

    /* istanbul ignore else */
    if (imageId) {
      await updateImageMutation({
        variables: {
          input: {
            id: parseIdFromAtId(imageId) as string,
            ...imageDetails,
          },
        },
      });
    }
  };

  const updateEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus,
    { onError, onSuccess }: Callbacks
  ) => {
    try {
      setSaving(MODALS.UPDATE);
      const { atId, id, superEventType } = getEventFields(event, locale);
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

      // Call callback function if defined
      /* istanbul ignore else */
      if (onSuccess) {
        await onSuccess();
      }
      closeModal();
      setSaving(null);
    } catch (e) /* istanbul ignore next */ {
      setSaving(null);
      // Call callback function if defined
      if (onError) {
        onError();
      }
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
