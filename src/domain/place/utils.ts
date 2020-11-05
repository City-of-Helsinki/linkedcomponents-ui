import {
  PlaceQueryVariables,
  PlacesQueryVariables,
} from '../../generated/graphql';
import queryBuilder from '../../utils/queryBuilder';

interface PlacePathBuilderProps {
  args: PlaceQueryVariables;
}

export const placePathBuilder = ({ args }: PlacePathBuilderProps) => {
  const { id } = args;

  return `/place/${id}/`;
};

interface PlacesPathBuilderProps {
  args: PlacesQueryVariables;
}

export const placesPathBuilder = ({ args }: PlacesPathBuilderProps) => {
  const {
    dataSource,
    division,
    hasUpcomingEvents,
    page,
    pageSize,
    showAllPlaces,
    sort,
    text,
  } = args;

  const variableToKeyItems = [
    { key: 'data_source', value: dataSource },
    { key: 'division', value: division },
    { key: 'has_upcoming_events', value: hasUpcomingEvents },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'show_all_places', value: showAllPlaces },
    { key: 'sort', value: sort },
    { key: 'text', value: text },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/place/${query}`;
};
