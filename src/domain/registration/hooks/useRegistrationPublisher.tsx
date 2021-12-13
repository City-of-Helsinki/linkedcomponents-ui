import {
  RegistrationFieldsFragment,
  useEventQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getPathBuilder from '../../../utils/getPathBuilder';
import { EVENT_INCLUDES } from '../../event/constants';
import { eventPathBuilder, getEventFields } from '../../event/utils';
import { getRegistrationFields } from '../../registrations/utils';

interface Props {
  registration: RegistrationFieldsFragment;
}
const useRegistrationPublisher = ({ registration }: Props): string | null => {
  const locale = useLocale();
  const { event: eventId } = getRegistrationFields(registration, locale);

  const { data: eventData } = useEventQuery({
    skip: !eventId,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: eventId,
      include: EVENT_INCLUDES,
    },
  });

  const { publisher } = eventData?.event
    ? getEventFields(eventData?.event, locale)
    : { publisher: '' };

  return publisher;
};

export default useRegistrationPublisher;
