import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import isEqual from 'date-fns/isEqual';
import isFuture from 'date-fns/isFuture';
import { useTranslation } from 'react-i18next';

import {
  EventFieldsFragment,
  PublicationStatus,
  SuperEventType,
  UserFieldsFragment,
  useUpdateEventMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import getDateFromString from '../../../utils/getDateFromString';
import getValue from '../../../utils/getValue';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import skipFalsyType from '../../../utils/skipFalsyType';
import useAuth from '../../auth/hooks/useAuth';
import { getOrganizationAncestorsQueryResult } from '../../organization/utils';
import useUser from '../../user/hooks/useUser';
import { EVENT_ACTIONS } from '../constants';
import { EventTime } from '../types';
import {
  calculateSuperEventTime,
  checkIsActionAllowed,
  getEventBasePayload,
  getEventInitialValues,
  getRecurringEvent,
} from '../utils';

type UpdateRecurringEventIfNeededState = {
  updateRecurringEventIfNeeded: (
    values: EventFieldsFragment
  ) => Promise<EventFieldsFragment | null>;
  user: UserFieldsFragment | undefined;
};

export const shouldUpdateTime = (
  time: Date | null,
  newTime: Date | null
): boolean =>
  Boolean(
    [time, newTime].filter(skipFalsyType).length === 1 ||
      (time && newTime && !isEqual(time, newTime))
  );

const useUpdateRecurringEventIfNeeded =
  (): UpdateRecurringEventIfNeededState => {
    const apolloClient =
      useApolloClient() as ApolloClient<NormalizedCacheObject>;
    const { t } = useTranslation();
    const { authenticated } = useAuth();

    const { user } = useUser();
    const [updateEvent] = useUpdateEventMutation();

    const { handleError } = useHandleError<null, EventFieldsFragment>();

    // Update recurring super event start and end time in cases that
    // changes to sub-event causes changes to super event times. First calculate
    // new end and start time and if they are different that current super event
    // times update super event
    const updateRecurringEventIfNeeded = async (
      event: EventFieldsFragment
    ): Promise<EventFieldsFragment | null> => {
      if (!event.superEvent?.atId) return null;

      try {
        const superEvent = await getRecurringEvent(
          getValue(parseIdFromAtId(event.superEvent.atId), ''),
          apolloClient
        );

        if (superEvent?.superEventType !== SuperEventType.Recurring) {
          return null;
        }

        /* istanbul ignore next */
        const organizationAncestors = await getOrganizationAncestorsQueryResult(
          getValue(superEvent.publisher, ''),
          apolloClient
        );

        const publicationStatus = superEvent.publicationStatus;

        const { editable } = checkIsActionAllowed({
          action:
            /* istanbul ignore next */
            publicationStatus === PublicationStatus.Draft
              ? EVENT_ACTIONS.UPDATE_DRAFT
              : EVENT_ACTIONS.UPDATE_PUBLIC,
          authenticated,
          event: superEvent,
          organizationAncestors,
          t,
          user,
        });

        if (!editable) return null;

        const startTime = getDateFromString(superEvent?.startTime);
        const endTime = getDateFromString(superEvent?.endTime);

        const eventTimes: EventTime[] = getValue(superEvent?.subEvents, []).map(
          (subEvent) => ({
            endTime: getDateFromString(subEvent?.endTime),
            id: null,
            startTime: getDateFromString(subEvent?.startTime),
          })
        );
        const { endTime: calculatedEndTime, startTime: newStartTime } =
          calculateSuperEventTime(eventTimes);

        // Changing end time to a past date would cause 400 error on LE BE,
        // so update end time only if it's in the future or null
        const newEndTime =
          !calculatedEndTime || isFuture(calculatedEndTime)
            ? calculatedEndTime
            : endTime;

        if (
          !(
            shouldUpdateTime(startTime, newStartTime) ||
            shouldUpdateTime(endTime, newEndTime)
          )
        ) {
          return null;
        }

        const payload = {
          ...getEventBasePayload(
            getEventInitialValues(superEvent),
            publicationStatus as PublicationStatus
          ),
          id: superEvent.id,
          endTime: getValue(newEndTime?.toISOString(), null),
          startTime: getValue(newStartTime?.toISOString(), null),
          subEvents: getValue(
            superEvent?.subEvents.filter(skipFalsyType).map((subEvent) => ({
              atId: subEvent.atId,
            })),
            []
          ),
          superEvent:
            /* istanbul ignore next */
            superEvent.superEvent ? { atId: superEvent.superEvent.atId } : null,
          superEventType: SuperEventType.Recurring,
        };
        const data = await updateEvent({
          variables: { id: superEvent.id, input: payload },
        });

        return getValue(data.data?.updateEvent, null);
      } catch (error) /* istanbul ignore next */ {
        handleError({
          error,
          message: 'Failed to update recurring event',
          object: event,
          savingFinished:
            /* istanbul ignore next */
            () => undefined,
        });

        throw error;
      }
    };

    return { updateRecurringEventIfNeeded, user };
  };

export default useUpdateRecurringEventIfNeeded;
