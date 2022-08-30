import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import NoDataRow from '../../../common/components/table/noDataRow/NoDataRow';
import SortableColumn from '../../../common/components/table/sortableColumn/SortableColumn';
import Table from '../../../common/components/table/Table';
import {
  KeywordFieldsFragment,
  KeywordsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import useSetFocused from '../../../hooks/useSetFocused';
import { getKeywordFields } from '../../keyword/utils';
import { KEYWORD_SORT_OPTIONS } from '../constants';
import styles from './keywordsTable.module.scss';
import KeywordsTableRow from './keywordsTableRow/KeywordsTableRow';

export interface KeywordsTableProps {
  caption: string;
  className?: string;
  keywords: KeywordsQuery['keywords']['data'];
  setSort: (sort: KEYWORD_SORT_OPTIONS) => void;
  sort: KEYWORD_SORT_OPTIONS;
}

const KeywordsTable: React.FC<KeywordsTableProps> = ({
  caption,
  className,
  keywords,
  setSort,
  sort,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();

  const table = React.useRef<HTMLTableElement>(null);
  const { focused } = useSetFocused(table);

  const handleRowClick = (keyword: KeywordFieldsFragment) => {
    const { keywordUrl } = getKeywordFields(keyword, locale);

    navigate({
      pathname: keywordUrl,
      search: queryStringWithReturnPath,
    });
  };

  const handleSort = (key: string) => {
    setSort(key as KEYWORD_SORT_OPTIONS);
  };

  return (
    <Table ref={table} className={className}>
      <caption aria-live={focused ? 'polite' : undefined}>{caption}</caption>
      <thead>
        <tr>
          <SortableColumn
            className={styles.idColumn}
            label={t('keywordsPage.keywordsTableColumns.id')}
            onClick={handleSort}
            sort={sort}
            sortKey={KEYWORD_SORT_OPTIONS.ID}
            type="text"
          />
          <SortableColumn
            className={styles.nameColumn}
            label={t('keywordsPage.keywordsTableColumns.name')}
            onClick={handleSort}
            sort={sort}
            sortKey={KEYWORD_SORT_OPTIONS.NAME}
            type="text"
          />
          <SortableColumn
            className={styles.nEventsColumn}
            label={t('keywordsPage.keywordsTableColumns.nEvents')}
            onClick={handleSort}
            sort={sort}
            sortKey={KEYWORD_SORT_OPTIONS.N_EVENTS}
            type="default"
          />

          <th className={styles.actionButtonsColumn}></th>
        </tr>
      </thead>
      <tbody>
        {keywords.map(
          (keyword) =>
            keyword && (
              <KeywordsTableRow
                key={keyword.id}
                keyword={keyword}
                onRowClick={handleRowClick}
              />
            )
        )}
        {!keywords.length && <NoDataRow colSpan={4} />}
      </tbody>
    </Table>
  );
};

export default KeywordsTable;
