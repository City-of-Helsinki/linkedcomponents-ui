import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import isEqual from 'date-fns/isEqual';
import isFuture from 'date-fns/isFuture';
import isNull from 'lodash/isNull';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import {
  EventFieldsFragment,
  PublicationStatus,
  SuperEventType,
  useUpdateEventMutation,
} from '../../../generated/graphql';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import { reportError } from '../../app/sentry/utils';
import { authenticatedSelector } from '../../auth/selectors';
import { getOrganizationAncestorsQueryResult } from '../../organization/utils';
import useUser from '../../user/hooks/useUser';
import { EVENT_EDIT_ACTIONS } from '../constants';
import { EventTime } from '../types';
import {
  calculateSuperEventTime,
  checkIsEditActionAllowed,
  getEventInitialValues,
  getEventPayload,
  getRecurringEvent,
} from '../utils';

type UpdateRecurringEventIfNeededState = {
  updateRecurringEventIfNeeded: (
    values: EventFieldsFragment
  ) => Promise<EventFieldsFragment | null>;
};

const useUpdateRecurringEventIfNeeded =
  (): UpdateRecurringEventIfNeededState => {
    const apolloClient =
      useApolloClient() as ApolloClient<NormalizedCacheObject>;
    const location = useLocation();
    const { t } = useTranslation();
    const authenticated = useSelector(authenticatedSelector);

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

        const organizationAncestors = await getOrganizationAncestorsQueryResult(
          superEvent.id,
          apolloClient
        );

        const publicationStatus = superEvent.publicationStatus;

        const { editable } = checkIsEditActionAllowed({
          action:
            publicationStatus === PublicationStatus.Draft
              ? EVENT_EDIT_ACTIONS.UPDATE_DRAFT
              : EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
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

        const eventTimes: EventTime[] = (superEvent?.subEvents ?? []).map(
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

        const data = await updateEvent({
          variables: {
            input: {
              ...getEventPayload(
                { ...getEventInitialValues(superEvent), events: [] },
                publicationStatus as PublicationStatus
              ),
              id: superEvent.id as string,
              endTime: newEndTime?.toISOString() ?? null,
              startTime: newStartTime?.toISOString() ?? null,
              subEvents:
                superEvent?.subEvents.map((subEvent) => ({
                  atId: subEvent?.atId as string,
                })) || [],
              superEventType: SuperEventType.Recurring,
            },
          },
        });

        return data.data?.updateEvent ?? null;
      } catch (error) {
        reportError({
          data: {
            error,
            event,
          },
          location,
          message: 'Failed to update recurring event',
          user,
        });
        throw error;
      }
    };

    return { updateRecurringEventIfNeeded };
  };

export default useUpdateRecurringEventIfNeeded;
