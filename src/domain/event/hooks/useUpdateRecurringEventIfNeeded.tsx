import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import isEqual from 'date-fns/isEqual';
import isFuture from 'date-fns/isFuture';
import isNull from 'lodash/isNull';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import {
  EventFieldsFragment,
  PublicationStatus,
  SuperEventType,
  UserFieldsFragment,
  useUpdateEventMutation,
} from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import skipFalsyType from '../../../utils/skipFalsyType';
import { reportError } from '../../app/sentry/utils';
import { useAuth } from '../../auth/hooks/useAuth';
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

const useUpdateRecurringEventIfNeeded =
  (): UpdateRecurringEventIfNeededState => {
    const apolloClient =
      useApolloClient() as ApolloClient<NormalizedCacheObject>;
    const location = useLocation();
    const { t } = useTranslation();
    const { isAuthenticated: authenticated } = useAuth();

    const { user } = useUser();
    const [updateEvent] = useUpdateEventMutation();

    const shouldUpdateTime = (time: Date | null, newTime: Date | null) =>
      ((isNull(time) || isNull(newTime)) && time !== newTime) ||
      (time && newTime && !isEqual(time, newTime));

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
          parseIdFromAtId(event.superEvent.atId) as string,
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

        const startTime = superEvent?.startTime
          ? new Date(superEvent.startTime)
          : null;
        const endTime = superEvent?.endTime
          ? new Date(superEvent.endTime)
          : null;

        const eventTimes: EventTime[] = getValue(superEvent?.subEvents, []).map(
          (subEvent) => ({
            endTime: subEvent?.endTime ? new Date(subEvent.endTime) : null,
            id: null,
            startTime: subEvent?.startTime
              ? new Date(subEvent.startTime)
              : null,
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
          superEvent: superEvent.superEvent
            ? { atId: superEvent.superEvent.atId }
            : null,
          superEventType: SuperEventType.Recurring,
        };
        const data = await updateEvent({ variables: { input: payload } });

        return getValue(data.data?.updateEvent, null);
      } catch (error) {
        reportError({
          data: {
            error: error as Record<string, unknown>,
            event,
          },
          location,
          message: 'Failed to update recurring event',
          user,
        });
        throw error;
      }
    };

    return { updateRecurringEventIfNeeded, user };
  };

export default useUpdateRecurringEventIfNeeded;
