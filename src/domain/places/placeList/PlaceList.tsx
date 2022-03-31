import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { scroller } from 'react-scroll';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import SearchInput from '../../../common/components/searchInput/SearchInput';
import TableWrapper from '../../../common/components/table/TableWrapper';
import { PlacesQuery, usePlacesQuery } from '../../../generated/graphql';
import getPageCount from '../../../utils/getPageCount';
import { scrollToItem } from '../../../utils/scrollToItem';
import { getPlaceItemId } from '../../place/utils';
import {
  DEFAULT_PLACE_SORT,
  PLACE_SORT_OPTIONS,
  PLACES_PAGE_SIZE,
} from '../constants';
import usePlacesSortOptions from '../hooks/usePlacesSortOptions';
import PlacesTable from '../placesTable/PlacesTable';
import { PlacesLocationState } from '../types';
import {
  getPlaceSearchInitialValues,
  getPlacesQueryVariables,
  replaceParamsToPlaceQueryString,
} from '../utils';
import styles from './placeList.module.scss';

export const testIds = {
  resultList: 'place-result-list',
};

type PlaceListProps = {
  onSelectedPageChange: (page: number) => void;
  onSortChange: (sort: PLACE_SORT_OPTIONS) => void;
  page: number;
  pageCount: number;
  places: PlacesQuery['places']['data'];
  sort: PLACE_SORT_OPTIONS;
};

const PlaceList: React.FC<PlaceListProps> = ({
  onSelectedPageChange,
  onSortChange,
  page,
  pageCount,
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
      // Clear keywordId value to keep scroll position correctly
      const state = omit(locationState, 'placeId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <TableWrapper>
        <PlacesTable
          caption={getTableCaption()}
          places={places}
          setSort={onSortChange}
          sort={sort as PLACE_SORT_OPTIONS}
        />
      </TableWrapper>
      {pageCount > 1 && (
        <Pagination
          pageCount={pageCount}
          selectedPage={page}
          setSelectedPage={onSelectedPageChange}
        />
      )}
    </div>
  );
};

const PlaceListContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [placeListId] = React.useState(() => uniqueId('place-list-'));
  const { t } = useTranslation();
  const { page, sort, text } = getPlaceSearchInitialValues(location.search);
  const [search, setSearch] = React.useState(text);

  const handleSelectedPageChange = (page: number) => {
    navigate({
      pathname: location.pathname,
      search: replaceParamsToPlaceQueryString(location.search, {
        page: page > 1 ? page : null,
      }),
    });
    // Scroll to the beginning of keyword list
    scroller.scrollTo(placeListId, { offset: -100 });
  };

  const handleSearchChange = (text: string) => {
    navigate({
      pathname: location.pathname,
      search: replaceParamsToPlaceQueryString(location.search, {
        page: null,
        text,
      }),
    });
  };

  const handleSortChange = (val: PLACE_SORT_OPTIONS) => {
    navigate({
      pathname: location.pathname,
      search: replaceParamsToPlaceQueryString(location.search, {
        sort:
          val !== DEFAULT_PLACE_SORT ? val : /* istanbul ignore next */ null,
      }),
    });
  };

  const { data: placesData, loading } = usePlacesQuery({
    variables: getPlacesQueryVariables(location.search),
  });

  /* istanbul ignore next */
  const places = placesData?.places?.data || [];
  /* istanbul ignore next */
  const placesCount = placesData?.places?.meta.count || 0;
  const pageCount = getPageCount(placesCount, PLACES_PAGE_SIZE);

  return (
    <div id={placeListId} data-testid={testIds.resultList}>
      <div className={styles.searchRow}>
        <span className={styles.count}>
          {t('placesPage.count', { count: placesCount })}
        </span>
        <SearchInput
          className={styles.searchInput}
          label={t('placesPage.labelSearch')}
          hideLabel
          onSearch={handleSearchChange}
          setValue={setSearch}
          value={search}
        />
      </div>

      <LoadingSpinner isLoading={loading}>
        <PlaceList
          onSelectedPageChange={handleSelectedPageChange}
          onSortChange={handleSortChange}
          page={page}
          pageCount={pageCount}
          places={places}
          sort={sort}
        />
      </LoadingSpinner>
    </div>
  );
};

export default PlaceListContainer;
