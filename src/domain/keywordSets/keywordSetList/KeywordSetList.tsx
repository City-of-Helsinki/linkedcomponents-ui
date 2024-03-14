import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import { testIds } from '../../../constants';
import {
  KeywordSetsQuery,
  useKeywordSetsQuery,
} from '../../../generated/graphql';
import useCommonListProps from '../../../hooks/useCommonListProps';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import { CommonListProps } from '../../../types';
import getValue from '../../../utils/getValue';
import { scrollToItem } from '../../../utils/scrollToItem';
import AdminSearchRow from '../../admin/layout/adminSearchRow/AdminSearchRow';
import { getKeywordSetItemId } from '../../keywordSet/utils';
import {
  DEFAULT_KEYWORD_SET_SORT,
  KEYWORD_SET_SORT_OPTIONS,
  KEYWORD_SETS_PAGE_SIZE,
} from '../constants';
import useKeywordSetSortOptions from '../hooks/useKeywordSetSortOptions';
import KeywordSetsTable from '../keywordSetsTable/KeywordSetsTable';
import { KeywordSetsLocationState } from '../types';
import {
  getKeywordSetSearchInitialValues,
  getKeywordSetsQueryVariables,
} from '../utils';

type KeywordSetListProps = {
  keywordSets: KeywordSetsQuery['keywordSets']['data'];
  page: number;
  sort: KEYWORD_SET_SORT_OPTIONS;
} & CommonListProps;

const KeywordSetList: React.FC<KeywordSetListProps> = ({
  keywordSets,
  onPageChange,
  onSortChange,
  page,
  pageCount,
  pageHref,
  sort,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const sortOptions = useKeywordSetSortOptions();

  const getTableCaption = () => {
    return t(`keywordSetsPage.keywordSetsTableCaption`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  React.useEffect(() => {
    const locationState = location.state as KeywordSetsLocationState;
    if (locationState?.keywordSetId) {
      scrollToItem(getKeywordSetItemId(locationState.keywordSetId));
      // Clear keywordSetId value to keep scroll position correctly
      const state = omit(locationState, 'keywordSetId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <KeywordSetsTable
        caption={getTableCaption()}
        keywordSets={keywordSets}
        setSort={onSortChange}
        sort={sort as KEYWORD_SET_SORT_OPTIONS}
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

const KeywordSetListContainer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { page, sort, text } = getKeywordSetSearchInitialValues(
    location.search
  );
  const [search, setSearch] = React.useState(text);

  const keywordSetListId = useIdWithPrefix({ prefix: 'keyword-set-list-' });

  const { data: keywordSetsData, loading } = useKeywordSetsQuery({
    variables: getKeywordSetsQueryVariables(location.search),
  });

  const keywordSets = getValue(keywordSetsData?.keywordSets?.data, []);
  const { count, onSearchSubmit, ...listProps } = useCommonListProps({
    defaultSort: DEFAULT_KEYWORD_SET_SORT,
    listId: keywordSetListId,
    meta: keywordSetsData?.keywordSets?.meta,
    pageSize: KEYWORD_SETS_PAGE_SIZE,
  });

  return (
    <div id={keywordSetListId} data-testid={testIds.keywordSetList.resultList}>
      <AdminSearchRow
        countText={t('keywordSetsPage.count', { count })}
        onSearchChange={setSearch}
        onSearchSubmit={onSearchSubmit}
        searchInputLabel={t('keywordSetsPage.labelSearch')}
        searchValue={search}
      />

      <LoadingSpinner isLoading={loading}>
        <KeywordSetList
          keywordSets={keywordSets}
          page={page}
          sort={sort}
          {...listProps}
        />
      </LoadingSpinner>
    </div>
  );
};

export default KeywordSetListContainer;
