import {
  EventFieldsFragment,
  PlaceFieldsFragment,
  usePlaceQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import { placePathBuilder } from '../../place/utils';

type UseEventLocationState = {
  loading: boolean;
  location: PlaceFieldsFragment | null;
};

const useEventLocation = (
  event: EventFieldsFragment
): UseEventLocationState => {
  /* istanbul ignore next */
  const id: string = event.location?.atId
    ? getValue(parseIdFromAtId(event.location?.atId), '')
    : '';
  const { data, loading } = usePlaceQuery({
    skip: !id,
    variables: { createPath: getPathBuilder(placePathBuilder), id },
  });

  return { loading, location: getValue(data?.place, null) };
};

export default useEventLocation;
