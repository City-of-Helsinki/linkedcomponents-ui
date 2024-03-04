import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import { testIds } from '../../../constants';
import { KeywordsQuery, useKeywordsQuery } from '../../../generated/graphql';
import useCommonListProps from '../../../hooks/useCommonListProps';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import { CommonListProps } from '../../../types';
import getValue from '../../../utils/getValue';
import { scrollToItem } from '../../../utils/scrollToItem';
import AdminSearchRow from '../../admin/layout/adminSearchRow/AdminSearchRow';
import { getKeywordItemId } from '../../keyword/utils';
import {
  DEFAULT_KEYWORD_SORT,
  KEYWORD_SORT_OPTIONS,
  KEYWORDS_PAGE_SIZE,
} from '../constants';
import useKeywordSortOptions from '../hooks/useKeywordsSortOptions';
import KeywordsTable from '../keywordsTable/KeywordsTable';
import { KeywordsLocationState } from '../types';
import {
  getKeywordSearchInitialValues,
  getKeywordsQueryVariables,
} from '../utils';

type KeywordListProps = {
  keywords: KeywordsQuery['keywords']['data'];
  page: number;
  sort: KEYWORD_SORT_OPTIONS;
} & CommonListProps;

const KeywordList: React.FC<KeywordListProps> = ({
  keywords,
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
  const sortOptions = useKeywordSortOptions();

  const getTableCaption = () => {
    return t(`keywordsPage.keywordsTableCaption`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  React.useEffect(() => {
    const locationState = location.state as KeywordsLocationState;
    if (locationState?.keywordId) {
      scrollToItem(getKeywordItemId(locationState.keywordId));
      // Clear keywordId value to keep scroll position correctly
      const state = omit(locationState, 'keywordId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <KeywordsTable
        caption={getTableCaption()}
        keywords={keywords}
        setSort={onSortChange}
        sort={sort as KEYWORD_SORT_OPTIONS}
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

const KeywordListContainer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { page, sort, text } = getKeywordSearchInitialValues(location.search);
  const [search, setSearch] = React.useState(text);

  const keywordListId = useIdWithPrefix({ prefix: 'keyword-list-' });

  const { data: keywordsData, loading } = useKeywordsQuery({
    variables: getKeywordsQueryVariables(location.search),
  });

  const keywords = getValue(keywordsData?.keywords?.data, []);
  const { count, onSearchSubmit, ...listProps } = useCommonListProps({
    defaultSort: DEFAULT_KEYWORD_SORT,
    listId: keywordListId,
    meta: keywordsData?.keywords.meta,
    pageSize: KEYWORDS_PAGE_SIZE,
  });

  return (
    <div id={keywordListId} data-testid={testIds.keywordList.resultList}>
      <AdminSearchRow
        countText={t('keywordsPage.count', { count })}
        onSearchSubmit={onSearchSubmit}
        onSearchChange={setSearch}
        searchInputLabel={t('keywordsPage.labelSearch')}
        searchValue={search}
      />

      <LoadingSpinner isLoading={loading}>
        <KeywordList
          keywords={keywords}
          page={page}
          sort={sort}
          {...listProps}
        />
      </LoadingSpinner>
    </div>
  );
};

export default KeywordListContainer;
