import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { scroller } from 'react-scroll';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import SearchInput from '../../../common/components/searchInput/SearchInput';
import {
  EventsQueryVariables,
  KeywordsQuery,
  useKeywordsQuery,
} from '../../../generated/graphql';
import getPageCount from '../../../utils/getPageCount';
import { scrollToItem } from '../../../utils/scrollToItem';
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
  replaceParamsToKeywordQueryString,
} from '../utils';
import styles from './keywordList.module.scss';

export interface EventListContainerProps {
  baseVariables: EventsQueryVariables;
}

export const testIds = {
  resultList: 'keyword-result-list',
};

type KeywordListProps = {
  keywords: KeywordsQuery['keywords']['data'];
  onSelectedPageChange: (page: number) => void;
  onSortChange: (sort: KEYWORD_SORT_OPTIONS) => void;
  page: number;
  pageCount: number;
  sort: KEYWORD_SORT_OPTIONS;
};

const KeywordList: React.FC<KeywordListProps> = ({
  keywords,
  onSelectedPageChange,
  onSortChange,
  page,
  pageCount,
  sort,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation<KeywordsLocationState>();
  const sortOptions = useKeywordSortOptions();

  const getTableCaption = () => {
    return t(`keywordsPage.keywordsTableCaption`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  React.useEffect(() => {
    if (location.state?.keywordId) {
      scrollToItem(getKeywordItemId(location.state.keywordId));
      // Clear keywordId value to keep scroll position correctly
      const state = omit(location.state, 'keywordId');
      // location.search seems to reset if not added here (...location)
      history.replace({ ...location, state });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className={styles.table}>
        <KeywordsTable
          caption={getTableCaption()}
          keywords={keywords}
          setSort={onSortChange}
          sort={sort as KEYWORD_SORT_OPTIONS}
        />
      </div>
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

const KeywordListContainer: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [keywordListId] = React.useState(() => uniqueId('keyword-list-'));
  const { t } = useTranslation();
  const { page, sort, text } = getKeywordSearchInitialValues(location.search);
  const [search, setSearch] = React.useState(text);

  const handleSelectedPageChange = (page: number) => {
    history.push({
      pathname: location.pathname,
      search: replaceParamsToKeywordQueryString(location.search, {
        page: page > 1 ? page : null,
      }),
    });
    // Scroll to the beginning of keyword list
    scroller.scrollTo(keywordListId, { offset: -100 });
  };

  const handleSearchChange = (text: string) => {
    history.push({
      pathname: location.pathname,
      search: replaceParamsToKeywordQueryString(location.search, {
        page: null,
        text,
      }),
    });
  };

  const handleSortChange = (val: KEYWORD_SORT_OPTIONS) => {
    history.push({
      pathname: location.pathname,
      search: replaceParamsToKeywordQueryString(location.search, {
        sort: val !== DEFAULT_KEYWORD_SORT ? val : null,
      }),
    });
  };

  const { data: keywordsData, loading } = useKeywordsQuery({
    variables: getKeywordsQueryVariables(location.search),
  });

  /* istanbul ignore next */
  const keywords = keywordsData?.keywords?.data || [];
  /* istanbul ignore next */
  const keywordsCount = keywordsData?.keywords?.meta.count || 0;
  const pageCount = getPageCount(keywordsCount, KEYWORDS_PAGE_SIZE);

  return (
    <div id={keywordListId} data-testid={testIds.resultList}>
      <div className={styles.searchRow}>
        <span className={styles.count}>
          {t('keywordsPage.count', { count: keywordsCount })}
        </span>
        <SearchInput
          className={styles.searchInput}
          label={t('keywordsPage.labelSearch')}
          hideLabel
          onSearch={handleSearchChange}
          setValue={setSearch}
          value={search}
        />
      </div>

      <LoadingSpinner isLoading={loading}>
        <KeywordList
          keywords={keywords}
          onSelectedPageChange={handleSelectedPageChange}
          onSortChange={handleSortChange}
          page={page}
          pageCount={pageCount}
          sort={sort}
        />
      </LoadingSpinner>
    </div>
  );
};

export default KeywordListContainer;
