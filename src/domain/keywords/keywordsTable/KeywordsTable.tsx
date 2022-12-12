import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import Table from '../../../common/components/table/Table2';
import {
  KeywordFieldsFragment,
  KeywordsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import getInitialSort from '../../../utils/getInitialSort';
import getNewSort from '../../../utils/getNewSort';
import { getKeywordFields, getKeywordItemId } from '../../keyword/utils';
import { KEYWORD_SORT_OPTIONS } from '../constants';
import KeywordActionsDropdown from '../keywordActionsDropdown/KeywordActionsDropdown';
import styles from './keywordsTable.module.scss';

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
    <Link
      onClick={/* istanbul ignore next */ (e) => e.preventDefault()}
      to={keywordUrl}
    >
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

  const handleRowClick = (keyword: object) => {
    const { keywordUrl } = getKeywordFields(
      keyword as KeywordFieldsFragment,
      locale
    );

    navigate({
      pathname: keywordUrl,
      search: queryStringWithReturnPath,
    });
  };

  const handleSortChange = (key: string) => {
    setSort(key as KEYWORD_SORT_OPTIONS);
  };

  return (
    <Table
      caption={caption}
      className={className}
      cols={[
        {
          className: styles.idColumn,
          isSortable: true,
          key: KEYWORD_SORT_OPTIONS.ID,
          headerName: t('keywordsPage.keywordsTableColumns.id'),
          sortIconType: 'string',
          transform: (keyword: KeywordFieldsFragment) => (
            <IdColumn keyword={keyword} />
          ),
        },
        {
          className: styles.nameColumn,
          isSortable: true,
          key: KEYWORD_SORT_OPTIONS.NAME,
          headerName: t('keywordsPage.keywordsTableColumns.name'),
          sortIconType: 'string',
          transform: (keyword: KeywordFieldsFragment) => (
            <NameColumn keyword={keyword} />
          ),
        },
        {
          className: styles.nEventsColumn,
          isSortable: true,
          key: KEYWORD_SORT_OPTIONS.N_EVENTS,
          headerName: t('keywordsPage.keywordsTableColumns.nEvents'),
          sortIconType: 'string',
          transform: (keyword: KeywordFieldsFragment) => (
            <EventsAmountColumn keyword={keyword} />
          ),
        },
        {
          className: styles.actionButtonsColumn,
          key: 'actionButtons',
          headerName: '',
          onClick: (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
          },
          transform: (keyword: KeywordFieldsFragment) => (
            <KeywordActionsDropdown keyword={keyword} />
          ),
        },
      ]}
      {...getInitialSort(sort)}
      getRowProps={(keyword) => {
        const { id, name } = getKeywordFields(
          keyword as KeywordFieldsFragment,
          locale
        );

        return {
          'aria-label': name,
          'data-testid': id,
          id: getKeywordItemId(id),
        };
      }}
      indexKey="id"
      onRowClick={handleRowClick}
      onSort={(order, colKey, handleSort) => {
        handleSortChange(getNewSort({ order, colKey }));
        handleSort();
      }}
      rows={keywords as KeywordFieldsFragment[]}
      variant="light"
    />
  );
};

export default KeywordsTable;
