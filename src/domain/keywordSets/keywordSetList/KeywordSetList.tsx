import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { scroller } from 'react-scroll';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import SearchInput from '../../../common/components/searchInput/SearchInput';
import TableWrapper from '../../../common/components/table/tableWrapper/TableWrapper';
import { testIds } from '../../../constants';
import {
  KeywordSetsQuery,
  useKeywordSetsQuery,
} from '../../../generated/graphql';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import getPageCount from '../../../utils/getPageCount';
import { scrollToItem } from '../../../utils/scrollToItem';
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
  replaceParamsToKeywordSetQueryString,
} from '../utils';
import styles from './keywordSetList.module.scss';

type KeywordSetListProps = {
  keywordSets: KeywordSetsQuery['keywordSets']['data'];
  onPageChange: (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => void;
  onSortChange: (sort: KEYWORD_SET_SORT_OPTIONS) => void;
  page: number;
  pageCount: number;
  sort: KEYWORD_SET_SORT_OPTIONS;
};

const KeywordSetList: React.FC<KeywordSetListProps> = ({
  keywordSets,
  onPageChange,
  onSortChange,
  page,
  pageCount,
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
      <TableWrapper>
        <KeywordSetsTable
          caption={getTableCaption()}
          keywordSets={keywordSets}
          setSort={onSortChange}
          sort={sort as KEYWORD_SET_SORT_OPTIONS}
        />
      </TableWrapper>
      <Pagination
        pageCount={pageCount}
        pageHref={(index: number) => {
          return `${location.pathname}${replaceParamsToKeywordSetQueryString(
            location.search,
            { page: index > 1 ? index : null }
          )}`;
        }}
        pageIndex={page - 1}
        onChange={onPageChange}
      />
    </div>
  );
};

const KeywordSetListContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { page, sort, text } = getKeywordSetSearchInitialValues(
    location.search
  );
  const [search, setSearch] = React.useState(text);

  const keywordSetListId = useIdWithPrefix({ prefix: 'keyword-set-list-' });

  const handlePageChange = (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    event.preventDefault();

    const pageNumber = index + 1;
    navigate({
      pathname: location.pathname,
      search: replaceParamsToKeywordSetQueryString(location.search, {
        page: pageNumber > 1 ? pageNumber : null,
      }),
    });
    // Scroll to the beginning of keyword list
    scroller.scrollTo(keywordSetListId, { offset: -100 });
  };

  const handleSearchChange = (text: string) => {
    navigate({
      pathname: location.pathname,
      search: replaceParamsToKeywordSetQueryString(location.search, {
        page: null,
        text,
      }),
    });
  };

  const handleSortChange = (val: KEYWORD_SET_SORT_OPTIONS) => {
    navigate({
      pathname: location.pathname,
      search: replaceParamsToKeywordSetQueryString(location.search, {
        sort:
          val !== DEFAULT_KEYWORD_SET_SORT
            ? val
            : /* istanbul ignore next */ null,
      }),
    });
  };

  const { data: keywordSetsData, loading } = useKeywordSetsQuery({
    variables: getKeywordSetsQueryVariables(location.search),
  });

  /* istanbul ignore next */
  const keywordSets = keywordSetsData?.keywordSets?.data || [];
  /* istanbul ignore next */
  const keywordSetsCount = keywordSetsData?.keywordSets?.meta.count || 0;
  const pageCount = getPageCount(keywordSetsCount, KEYWORD_SETS_PAGE_SIZE);

  return (
    <div id={keywordSetListId} data-testid={testIds.keywordSetList.resultList}>
      <div className={styles.searchRow}>
        <span className={styles.count}>
          {t('keywordSetsPage.count', { count: keywordSetsCount })}
        </span>
        <SearchInput
          className={styles.searchInput}
          label={t('keywordSetsPage.labelSearch')}
          hideLabel
          onSearch={handleSearchChange}
          setValue={setSearch}
          value={search}
        />
      </div>

      <LoadingSpinner isLoading={loading}>
        <KeywordSetList
          keywordSets={keywordSets}
          onPageChange={handlePageChange}
          onSortChange={handleSortChange}
          page={page}
          pageCount={pageCount}
          sort={sort}
        />
      </LoadingSpinner>
    </div>
  );
};

export default KeywordSetListContainer;
