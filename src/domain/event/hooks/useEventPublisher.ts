import { useEventQuery } from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import { eventPathBuilder } from '../utils';

type UseEventPublisherProps = {
  eventId: string;
};

type UseEventPublisherState = {
  loading: boolean;
  publisher: string;
};
const useEventPublisher = ({
  eventId,
}: UseEventPublisherProps): UseEventPublisherState => {
  const { data: eventData, loading } = useEventQuery({
    skip: !eventId,
    variables: {
      id: eventId,
      createPath: getPathBuilder(eventPathBuilder),
    },
  });

  return { loading, publisher: getValue(eventData?.event.publisher, '') };
};

export default useEventPublisher;
