import React from 'react';
import { Link } from 'react-router-dom';

import { KeywordFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { getKeywordFields, getKeywordItemId } from '../../keyword/utils';
import KeywordActionsDropdown from '../keywordActionsDropdown/KeywordActionsDropdown';
import styles from './keywordsTable.module.scss';

interface Props {
  keyword: KeywordFieldsFragment;
  onRowClick: (keyword: KeywordFieldsFragment) => void;
}

const KeywordsTableRow: React.FC<Props> = ({ keyword, onRowClick }) => {
  const locale = useLocale();
  const actionsDropdownRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const { id, keywordUrl, name, nEvents } = getKeywordFields(keyword, locale);

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (
      ev.target instanceof Node &&
      rowRef.current?.contains(ev.target) &&
      !actionsDropdownRef.current?.contains(ev.target)
    ) {
      onRowClick(keyword);
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter' && ev.target === rowRef.current) {
      onRowClick(keyword);
    }
  };

  return (
    <>
      <tr
        ref={rowRef}
        role="button"
        aria-label={name}
        id={getKeywordItemId(id)}
        data-testid={id}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <td className={styles.idColumn}>{<Link to={keywordUrl}>{id}</Link>}</td>
        <td className={styles.nameColumn}>{name}</td>
        <td className={styles.nEventsColumn}>{nEvents}</td>
        <td className={styles.actionButtonsColumn}>
          <KeywordActionsDropdown ref={actionsDropdownRef} keyword={keyword} />
        </td>
      </tr>
    </>
  );
};

export default KeywordsTableRow;
