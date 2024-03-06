import {
  EventFieldsFragment,
  SuperEventType,
  useEventQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import { EVENT_WITH_SUB_EVENTS_INCLUDES } from '../../event/constants';
import { eventPathBuilder } from '../../event/utils';

type UseEventWithSubEventsDataProps = {
  id: string;
  superEventType: SuperEventType | null | undefined;
};

type UseEventWithSubEventsDataState = {
  eventWithSubEvents: EventFieldsFragment | undefined;
  loading: boolean;
};

const useEventWithSubEventsData = ({
  id,
  superEventType,
}: UseEventWithSubEventsDataProps): UseEventWithSubEventsDataState => {
  const { data: eventWithSubEventsData, loading } = useEventQuery({
    variables: {
      id,
      include: EVENT_WITH_SUB_EVENTS_INCLUDES,
      createPath: getPathBuilder(eventPathBuilder),
    },
    fetchPolicy: 'no-cache',
    skip: !superEventType,
  });

  return { eventWithSubEvents: eventWithSubEventsData?.event, loading };
};

export default useEventWithSubEventsData;
