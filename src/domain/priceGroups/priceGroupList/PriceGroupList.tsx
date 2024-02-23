import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import TableWrapper from '../../../common/components/table/tableWrapper/TableWrapper';
import { testIds } from '../../../constants';
import {
  PriceGroupsQuery,
  usePriceGroupsQuery,
} from '../../../generated/graphql';
import useCommonListProps from '../../../hooks/useCommonListProps';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import { CommonListProps } from '../../../types';
import getValue from '../../../utils/getValue';
import { scrollToItem } from '../../../utils/scrollToItem';
import AdminSearchRow from '../../admin/layout/adminSearchRow/AdminSearchRow';
import { PRICE_GROUPS_PAGE_SIZE } from '../../priceGroup/constants';
import { getPriceGroupItemId } from '../../priceGroup/utils';
import {
  DEFAULT_PRICE_GROUP_SORT,
  PRICE_GROUP_SORT_OPTIONS,
} from '../constants';
import usePriceGroupsSortOptions from '../hooks/usePriceGroupsSortOptions';
import PriceGroupsTable from '../priceGroupsTable/PriceGroupsTable';
import { PriceGroupsLocationState } from '../types';
import {
  getPriceGroupSearchInitialValues,
  getPriceGroupsQueryVariables,
} from '../utils';

type PriceGroupListProps = {
  page: number;
  priceGroups: PriceGroupsQuery['priceGroups']['data'];
  sort: PRICE_GROUP_SORT_OPTIONS;
} & CommonListProps;

const PriceGroupList: React.FC<PriceGroupListProps> = ({
  onPageChange,
  onSortChange,
  page,
  pageCount,
  pageHref,
  priceGroups,
  sort,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const sortOptions = usePriceGroupsSortOptions();

  const getTableCaption = () => {
    return t(`priceGroupsPage.priceGroupsTableCaption`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  React.useEffect(() => {
    const locationState = location.state as PriceGroupsLocationState;
    if (locationState?.priceGroupId) {
      scrollToItem(getPriceGroupItemId(locationState.priceGroupId));
      // Clear priceGroupId value to keep scroll position correctly
      const state = omit(locationState, 'priceGroupId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <TableWrapper>
        <PriceGroupsTable
          caption={getTableCaption()}
          priceGroups={priceGroups}
          setSort={onSortChange}
          sort={sort as PRICE_GROUP_SORT_OPTIONS}
        />
      </TableWrapper>

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

const PriceGroupListContainer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { page, sort, text } = getPriceGroupSearchInitialValues(
    location.search
  );
  const [search, setSearch] = React.useState(text);

  const priceGroupListId = useIdWithPrefix({ prefix: 'price-group-list-' });

  const { data: priceGroupsData, loading } = usePriceGroupsQuery({
    variables: getPriceGroupsQueryVariables(location.search),
  });

  const priceGroups = getValue(priceGroupsData?.priceGroups?.data, []);
  const { count, onSearchSubmit, ...listProps } = useCommonListProps({
    defaultSort: DEFAULT_PRICE_GROUP_SORT,
    listId: priceGroupListId,
    meta: priceGroupsData?.priceGroups.meta,
    pageSize: PRICE_GROUPS_PAGE_SIZE,
  });

  return (
    <div id={priceGroupListId} data-testid={testIds.priceGroupList.resultList}>
      <AdminSearchRow
        countText={t('priceGroupsPage.count', { count })}
        onSearchSubmit={onSearchSubmit}
        onSearchChange={setSearch}
        searchInputLabel={t('priceGroupsPage.labelSearch')}
        searchValue={search}
      />

      <LoadingSpinner isLoading={loading}>
        <PriceGroupList
          page={page}
          priceGroups={priceGroups}
          sort={sort}
          {...listProps}
        />
      </LoadingSpinner>
    </div>
  );
};

export default PriceGroupListContainer;
