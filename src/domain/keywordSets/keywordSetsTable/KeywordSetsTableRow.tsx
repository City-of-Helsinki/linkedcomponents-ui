import React from 'react';
import { Link } from 'react-router-dom';

import { KeywordSetFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import {
  getKeywordSetFields,
  getKeywordSetItemId,
} from '../../keywordSet/utils';
import useKeywordSetUsageOptions from '../hooks/useKeywordSetUsageOptions';
import styles from './keywordSetsTable.module.scss';

interface Props {
  keywordSet: KeywordSetFieldsFragment;
  onRowClick: (keyword: KeywordSetFieldsFragment) => void;
}

const KeywordSetsTableRow: React.FC<Props> = ({ keywordSet, onRowClick }) => {
  const locale = useLocale();
  const actionsDropdownRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const { id, keywordSetUrl, name, usage } = getKeywordSetFields(
    keywordSet,
    locale
  );

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (
      ev.target instanceof Node &&
      rowRef.current?.contains(ev.target) &&
      !actionsDropdownRef.current?.contains(ev.target)
    ) {
      onRowClick(keywordSet);
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter' && ev.target === rowRef.current) {
      onRowClick(keywordSet);
    }
  };

  const usageOptions = useKeywordSetUsageOptions();

  const getUsageText = (usage: string) => {
    return (
      usageOptions.find((option) => option.value === usage)?.label ||
      /* istanbul ignore next */ usage
    );
  };

  return (
    <>
      <tr
        ref={rowRef}
        role="button"
        aria-label={name}
        id={getKeywordSetItemId(id)}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <td className={styles.idColumn}>
          {<Link to={keywordSetUrl}>{id}</Link>}
        </td>
        <td className={styles.nameColumn}>{name}</td>
        <td className={styles.usageColumn}>{getUsageText(usage)}</td>
        <td className={styles.actionButtonsColumn}></td>
      </tr>
    </>
  );
};

export default KeywordSetsTableRow;
