import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import Table from '../../../common/components/table/Table';
import {
  KeywordFieldsFragment,
  KeywordsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getSortByOrderAndColKey from '../../../utils/getSortByOrderAndColKey';
import getSortOrderAndKey from '../../../utils/getSortOrderAndKey';
import { getKeywordFields, getKeywordItemId } from '../../keyword/utils';
import { KEYWORD_SORT_OPTIONS } from '../constants';
import KeywordActionsDropdown from '../keywordActionsDropdown/KeywordActionsDropdown';

export interface KeywordsTableProps {
  caption: string;
  className?: string;
  keywords: KeywordsQuery['keywords']['data'];
  setSort: (sort: KEYWORD_SORT_OPTIONS) => void;
  sort: KEYWORD_SORT_OPTIONS;
}

type ColumnProps = {
  keyword: KeywordFieldsFragment;
};

const IdColumn: FC<ColumnProps> = ({ keyword }) => {
  const locale = useLocale();
  const { keywordUrl, id } = getKeywordFields(keyword, locale);

  return (
    <Link id={getKeywordItemId(id)} to={keywordUrl}>
      {id}
    </Link>
  );
};

const NameColumn: FC<ColumnProps> = ({ keyword }) => {
  const locale = useLocale();
  const { name } = getKeywordFields(keyword, locale);

  return <>{name}</>;
};

const EventsAmountColumn: FC<ColumnProps> = ({ keyword }) => {
  const locale = useLocale();
  const { nEvents } = getKeywordFields(keyword, locale);

  return <>{nEvents}</>;
};

const ActionsColumn: FC<ColumnProps> = ({ keyword }) => {
  return <KeywordActionsDropdown keyword={keyword} />;
};

const KeywordsTable: React.FC<KeywordsTableProps> = ({
  caption,
  className,
  keywords,
  setSort,
  sort,
}) => {
  const { t } = useTranslation();

  const handleSortChange = (key: string) => {
    setSort(key as KEYWORD_SORT_OPTIONS);
  };

  const { initialSortingColumnKey, initialSortingOrder } = useMemo(() => {
    const { colKey, order } = getSortOrderAndKey(sort);

    return {
      initialSortingColumnKey: colKey,
      initialSortingOrder: order,
    };
  }, [sort]);

  const MemoizedIdColumn = React.useCallback(
    (keyword: KeywordFieldsFragment) => <IdColumn keyword={keyword} />,
    []
  );
  const MemoizedNameColumn = React.useCallback(
    (keyword: KeywordFieldsFragment) => <NameColumn keyword={keyword} />,
    []
  );
  const MemoizedEventsAmountColumn = React.useCallback(
    (keyword: KeywordFieldsFragment) => (
      <EventsAmountColumn keyword={keyword} />
    ),
    []
  );
  const MemoizedActionsColumn = React.useCallback(
    (keyword: KeywordFieldsFragment) => <ActionsColumn keyword={keyword} />,
    []
  );

  return (
    <Table
      caption={caption}
      cols={[
        {
          isSortable: true,
          key: KEYWORD_SORT_OPTIONS.ID,
          headerName: t('keywordsPage.keywordsTableColumns.id'),
          sortIconType: 'string',
          transform: MemoizedIdColumn,
        },
        {
          isSortable: true,
          key: KEYWORD_SORT_OPTIONS.NAME,
          headerName: t('keywordsPage.keywordsTableColumns.name'),
          sortIconType: 'string',
          transform: MemoizedNameColumn,
        },
        {
          isSortable: true,
          key: KEYWORD_SORT_OPTIONS.N_EVENTS,
          headerName: t('keywordsPage.keywordsTableColumns.nEvents'),
          sortIconType: 'string',
          transform: MemoizedEventsAmountColumn,
        },
        {
          key: 'actionButtons',
          headerName: t('common.actions'),
          transform: MemoizedActionsColumn,
        },
      ]}
      hasActionButtons
      indexKey="id"
      initialSortingColumnKey={initialSortingColumnKey}
      initialSortingOrder={initialSortingOrder}
      onSort={(order, colKey, handleSort) => {
        handleSortChange(getSortByOrderAndColKey({ order, colKey }));
        handleSort();
      }}
      rows={keywords as KeywordFieldsFragment[]}
      variant="light"
      wrapperClassName={className}
    />
  );
};

export default KeywordsTable;
