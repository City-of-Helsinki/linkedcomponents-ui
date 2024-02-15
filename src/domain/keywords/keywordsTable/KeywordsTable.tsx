import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

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

const IdColumn = (keyword: KeywordFieldsFragment) => {
  const locale = useLocale();
  const { keywordUrl, id } = getKeywordFields(keyword, locale);

  return (
    <Link id={getKeywordItemId(id)} to={keywordUrl}>
      {id}
    </Link>
  );
};

const NameColumn = (keyword: KeywordFieldsFragment) => {
  const locale = useLocale();
  const { name } = getKeywordFields(keyword, locale);

  return <>{name}</>;
};

const EventsAmountColumn = (keyword: KeywordFieldsFragment) => {
  const locale = useLocale();
  const { nEvents } = getKeywordFields(keyword, locale);

  return <>{nEvents}</>;
};

const ActionsColumn = (keyword: KeywordFieldsFragment) => {
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

  return (
    <Table
      caption={caption}
      cols={[
        {
          isSortable: true,
          key: KEYWORD_SORT_OPTIONS.ID,
          headerName: t('keywordsPage.keywordsTableColumns.id'),
          sortIconType: 'string',
          transform: IdColumn,
        },
        {
          isSortable: true,
          key: KEYWORD_SORT_OPTIONS.NAME,
          headerName: t('keywordsPage.keywordsTableColumns.name'),
          sortIconType: 'string',
          transform: NameColumn,
        },
        {
          isSortable: true,
          key: KEYWORD_SORT_OPTIONS.N_EVENTS,
          headerName: t('keywordsPage.keywordsTableColumns.nEvents'),
          sortIconType: 'string',
          transform: EventsAmountColumn,
        },
        {
          key: 'actionButtons',
          headerName: '',
          transform: ActionsColumn,
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
