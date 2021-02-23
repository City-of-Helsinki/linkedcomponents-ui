import { useApolloClient } from '@apollo/client';
import map from 'lodash/map';
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
import { clearEventQuery } from '../../events/utils';
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
  };

  const cancelEvent = async (callbacks?: Callbacks) => {
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
      await (callbacks?.onSuccess && callbacks.onSuccess());

      closeModal();
      setSaving(null);
    } catch (e) /* istanbul ignore next */ {
      setSaving(null);
      // Call callback function if defined
      await (callbacks?.onError && callbacks.onError());
    }
  };

  const deleteEvent = async (callbacks?: Callbacks) => {
    try {
      setSaving(MODALS.DELETE);
      // Make sure all related events are fetched
      const allEvents = await getRelatedEvents({ apolloClient, event });
      const allEventIds = map(allEvents, 'id');

      for (const id of allEventIds) {
        await deleteEventMutation({ variables: { id } });
      }

      // Clear all events from apollo cache
      for (const id of allEventIds) {
        clearEventQuery(apolloClient, id);
      }

      // Call callback function if defined
      await (callbacks?.onSuccess && callbacks.onSuccess());

      closeModal();
      setSaving(null);
    } catch (e) /* istanbul ignore next */ {
      setSaving(null);
      // Call callback function if defined
      await (callbacks?.onError && callbacks.onError());
    }
  };

  const postponeEvent = async (callbacks?: Callbacks) => {
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
      await (callbacks?.onSuccess && callbacks.onSuccess());

      closeModal();
      setSaving(null);
    } catch (e) /* istanbul ignore next */ {
      setSaving(null);
      // Call callback function if defined
      await (callbacks?.onError && callbacks.onError());
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
    callbacks?: Callbacks
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
      await (callbacks?.onSuccess && callbacks.onSuccess());

      closeModal();
      setSaving(null);
    } catch (e) /* istanbul ignore next */ {
      setSaving(null);
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
