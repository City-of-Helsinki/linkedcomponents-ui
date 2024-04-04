import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import SearchStatus from '../../../common/components/searchStatus/SearchStatus';
import { testIds } from '../../../constants';
import { PlacesQuery, usePlacesQuery } from '../../../generated/graphql';
import useCommonListProps from '../../../hooks/useCommonListProps';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import { CommonListProps } from '../../../types';
import getValue from '../../../utils/getValue';
import { scrollToItem } from '../../../utils/scrollToItem';
import AdminSearchRow from '../../admin/layout/adminSearchRow/AdminSearchRow';
import { getPlaceItemId } from '../../place/utils';
import {
  DEFAULT_PLACE_SORT,
  PLACE_SORT_OPTIONS,
  PLACES_PAGE_SIZE,
} from '../constants';
import usePlacesSortOptions from '../hooks/usePlacesSortOptions';
import PlacesTable from '../placesTable/PlacesTable';
import { PlacesLocationState } from '../types';
import { getPlaceSearchInitialValues, getPlacesQueryVariables } from '../utils';

type PlaceListProps = {
  page: number;
  places: PlacesQuery['places']['data'];
  sort: PLACE_SORT_OPTIONS;
} & CommonListProps;

const PlaceList: React.FC<PlaceListProps> = ({
  onPageChange,
  onSortChange,
  page,
  pageCount,
  pageHref,
  places,
  sort,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const sortOptions = usePlacesSortOptions();

  const getTableCaption = () => {
    return t(`placesPage.placesTableCaption`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  React.useEffect(() => {
    const locationState = location.state as PlacesLocationState;
    if (locationState?.placeId) {
      scrollToItem(getPlaceItemId(locationState.placeId));
      // Clear placeId value to keep scroll position correctly
      const state = omit(locationState, 'placeId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PlacesTable
        caption={getTableCaption()}
        places={places}
        setSort={onSortChange}
        sort={sort}
      />

      {pageCount > 1 && (
        <Pagination
          pageCount={pageCount}
          pageHref={pageHref}
          pageIndex={page - 1}
          onChange={onPageChange}
        />
      )}
    </div>
  );
};

const PlaceListContainer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { page, sort, text } = getPlaceSearchInitialValues(location.search);
  const [search, setSearch] = React.useState(text);

  const placeListId = useIdWithPrefix({ prefix: 'place-list-' });

  const { data: placesData, loading } = usePlacesQuery({
    variables: getPlacesQueryVariables(location.search),
  });

  const places = getValue(placesData?.places?.data, []);
  const { count, onSearchSubmit, ...listProps } = useCommonListProps({
    defaultSort: DEFAULT_PLACE_SORT,
    listId: placeListId,
    meta: placesData?.places?.meta,
    pageSize: PLACES_PAGE_SIZE,
  });

  return (
    <div id={placeListId} data-testid={testIds.placeList.resultList}>
      <SearchStatus count={count} loading={loading} />
      <AdminSearchRow
        countText={t('placesPage.count', { count })}
        onSearchSubmit={onSearchSubmit}
        onSearchChange={setSearch}
        searchInputLabel={t('placesPage.labelSearch')}
        searchValue={search}
      />

      <LoadingSpinner isLoading={loading}>
        <PlaceList page={page} places={places} sort={sort} {...listProps} />
      </LoadingSpinner>
    </div>
  );
};

export default PlaceListContainer;
