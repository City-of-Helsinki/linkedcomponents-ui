import {
  EventFieldsFragment,
  PlaceFieldsFragment,
  usePlaceQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
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
    ? (parseIdFromAtId(event.location?.atId) as string)
    : '';
  const { data, loading } = usePlaceQuery({
    skip: !id,
    variables: { createPath: getPathBuilder(placePathBuilder), id },
  });

  return { loading, location: data?.place ?? null };
};

export default useEventLocation;
