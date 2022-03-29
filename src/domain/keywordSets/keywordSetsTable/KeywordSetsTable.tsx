import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import NoDataRow from '../../../common/components/table/NoDataRow';
import SortableColumn from '../../../common/components/table/SortableColumn';
import Table from '../../../common/components/table/Table';
import {
  KeywordSetFieldsFragment,
  KeywordSetsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useSetFocused from '../../../hooks/useSetFocused';
import { getKeywordSetFields } from '../../keywordSet/utils';
import { KEYWORD_SET_SORT_OPTIONS } from '../constants';
import useKeywordSetsQueryStringWithReturnPath from '../hooks/useKeywordSetsQueryStringWithReturnPath';
import styles from './keywordSetsTable.module.scss';
import KeywordSetsTableRow from './KeywordSetsTableRow';

export interface KeywordSetsTableProps {
  caption: string;
  className?: string;
  keywordSets: KeywordSetsQuery['keywordSets']['data'];
  setSort: (sort: KEYWORD_SET_SORT_OPTIONS) => void;
  sort: KEYWORD_SET_SORT_OPTIONS;
}

const KeywordSetsTable: React.FC<KeywordSetsTableProps> = ({
  caption,
  className,
  keywordSets,
  setSort,
  sort,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();
  const queryStringWithReturnPath = useKeywordSetsQueryStringWithReturnPath();

  const table = React.useRef<HTMLTableElement>(null);
  const { focused } = useSetFocused(table);

  const handleRowClick = (keywordSet: KeywordSetFieldsFragment) => {
    const { keywordSetUrl } = getKeywordSetFields(keywordSet, locale);

    navigate({
      pathname: keywordSetUrl,
      search: queryStringWithReturnPath,
    });
  };

  const handleSort = (key: string) => {
    setSort(key as KEYWORD_SET_SORT_OPTIONS);
  };

  return (
    <Table ref={table} className={className}>
      <caption aria-live={focused ? 'polite' : undefined}>{caption}</caption>
      <thead>
        <tr>
          <SortableColumn
            className={styles.idColumn}
            label={t('keywordSetsPage.keywordSetsTableColumns.id')}
            onClick={handleSort}
            sort={sort}
            sortKey={KEYWORD_SET_SORT_OPTIONS.ID}
            type="text"
          />
          <SortableColumn
            className={styles.nameColumn}
            label={t('keywordSetsPage.keywordSetsTableColumns.name')}
            onClick={handleSort}
            sort={sort}
            sortKey={KEYWORD_SET_SORT_OPTIONS.NAME}
            type="text"
          />
          <SortableColumn
            className={styles.usageColumn}
            label={t('keywordSetsPage.keywordSetsTableColumns.usage')}
            onClick={handleSort}
            sort={sort}
            sortKey={KEYWORD_SET_SORT_OPTIONS.USAGE}
            type="default"
          />

          <th className={styles.actionButtonsColumn}></th>
        </tr>
      </thead>
      <tbody>
        {keywordSets.map(
          (keywordSet) =>
            keywordSet && (
              <KeywordSetsTableRow
                key={keywordSet.id}
                keywordSet={keywordSet}
                onRowClick={handleRowClick}
              />
            )
        )}
        {!keywordSets.length && <NoDataRow colSpan={6} />}
      </tbody>
    </Table>
  );
};

export default KeywordSetsTable;
