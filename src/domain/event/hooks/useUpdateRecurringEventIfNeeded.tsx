import { ApolloClient, InMemoryCache, useApolloClient } from '@apollo/client';
import isEqual from 'date-fns/isEqual';
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
import useUser from '../../user/hooks/useUser';
import { EVENT_EDIT_ACTIONS } from '../constants';
import { EventTime } from '../types';
import {
  calculateSuperEventTime,
  checkIsEditActionAllowed,
  getEventInitialValues,
  getEventPayload,
  getOrganizationAncestors,
  getRecurringEvent,
} from '../utils';

type UpdateRecurringEventIfNeededState = {
  updateRecurringEventIfNeeded: (values: EventFieldsFragment) => void;
};

const useUpdateRecurringEventIfNeeded =
  (): UpdateRecurringEventIfNeededState => {
    const apolloClient = useApolloClient() as ApolloClient<InMemoryCache>;
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
    const updateRecurringEventIfNeeded = async (event: EventFieldsFragment) => {
      if (event.superEvent?.atId) {
        try {
          const superEvent = await getRecurringEvent(
            parseIdFromAtId(event.superEvent.atId) as string,
            apolloClient
          );

          if (
            !superEvent ||
            superEvent.superEventType !== SuperEventType.Recurring
          ) {
            return;
          }

          const organizationAncestors = await getOrganizationAncestors({
            event: superEvent,
            apolloClient,
          });
          const publicationStatus =
            superEvent.publicationStatus as PublicationStatus;
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
          const { endTime: newEndTime, startTime: newStartTime } =
            calculateSuperEventTime(eventTimes);

          const { editable } = checkIsEditActionAllowed({
            action:
              publicationStatus === PublicationStatus.Draft
                ? EVENT_EDIT_ACTIONS.UPDATE_DRAFT
                : EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
            authenticated,
            event,
            organizationAncestors,
            t,
            user,
          });

          if (
            editable &&
            (shouldUpdateTime(startTime, newStartTime) ||
              shouldUpdateTime(endTime, newEndTime))
          ) {
            await updateEvent({
              variables: {
                input: {
                  ...getEventPayload(
                    { ...getEventInitialValues(superEvent), events: [] },
                    publicationStatus
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
          }
        } catch (error) {
          reportError({
            data: {
              error,
              event,
              eventAsString: JSON.stringify(event),
            },
            location,
            message: 'Failed to update recurring event',
            user,
          });
          throw error;
        }
      }
    };

    return { updateRecurringEventIfNeeded };
  };

export default useUpdateRecurringEventIfNeeded;
