import {
  ApolloClient,
  FetchResult,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useLocation } from 'react-router';

import {
  CreateEventMutationInput,
  CreateEventsMutation,
  PublicationStatus,
  useCreateEventMutation,
  useCreateEventsMutation,
  UserFieldsFragment,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import { clearEventsQueries } from '../../app/apollo/clearCacheUtils';
import { reportError } from '../../app/sentry/utils';
import useUser from '../../user/hooks/useUser';
import { EVENT_ACTIONS } from '../constants';
import { EventFormFields } from '../types';
import { getEventPayload, getRecurringEventPayload } from '../utils';
import useUpdateImageIfNeeded from './useUpdateImageIfNeeded';

type UseEventCreateActionsState = {
  createEvent: (
    values: EventFormFields,
    publicationStatus: PublicationStatus,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  saving: EVENT_ACTIONS | null;
  user: UserFieldsFragment | undefined;
};

const getAction = (publicationStatus: PublicationStatus): EVENT_ACTIONS => {
  switch (publicationStatus) {
    case PublicationStatus.Draft:
      return EVENT_ACTIONS.CREATE_DRAFT;
    case PublicationStatus.Public:
      return EVENT_ACTIONS.PUBLISH;
  }
};

const useEventCreateActions = (): UseEventCreateActionsState => {
  const { user } = useUser();
  const location = useLocation();
  const [saving, setSaving] = useMountedState<EVENT_ACTIONS | null>(null);
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;

  const [createEventMutation] = useCreateEventMutation();
  const [createEventsMutation] = useCreateEventsMutation();
  const { updateImageIfNeeded } = useUpdateImageIfNeeded();

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterCreate = async (
    id: string,
    callbacks?: MutationCallbacks
  ) => {
    // Clear all events queries from apollo cache to show added events in event list
    clearEventsQueries(apolloClient);

    savingFinished();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess(id));
  };

  const handleError = ({
    callbacks,
    data,
    error,
    message,
    payload,
  }: {
    callbacks?: MutationCallbacks;

    data?: Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: string;
    payload?: CreateEventMutationInput | CreateEventMutationInput[];
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        ...data,
        error,
        payloadAsString: payload && JSON.stringify(payload),
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
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
      });

      // Don't save recurring event if sub-event creation fails
      return;
    }

    /* istanbul ignore next */
    const subEventIds =
      eventsData?.data?.createEvents.map((item) => item.atId) || [];
    const recurringEventPayload = getRecurringEventPayload(
      payload,
      subEventIds,
      values
    );

    try {
      const recurringEventData = await createEventMutation({
        variables: { input: recurringEventPayload },
      });

      return recurringEventData.data?.createEvent.id as string;
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        payload: recurringEventPayload,
        message: 'Failed to create recurring event',
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

      return data.data?.createEvent.id as string;
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        payload,
        message: 'Failed to create event',
      });
    }
  };

  const createEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(getAction(publicationStatus));
    try {
      await updateImageIfNeeded(values);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        data: { images: values.images, imageDetails: values.imageDetails },
        error,
        message: 'Failed to update image',
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
      cleanAfterCreate(createdEventId, callbacks);
    }
  };

  return {
    createEvent,
    saving,
    user,
  };
};

export default useEventCreateActions;
