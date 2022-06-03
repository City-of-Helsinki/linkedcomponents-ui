import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from '../table.module.scss';

interface Props {
  colSpan: number;
  noDataText?: string;
}

const NoDataRow: React.FC<Props> = ({ colSpan, noDataText }) => {
  const { t } = useTranslation();
  return (
    <tr className={styles.noDataRow}>
      <td colSpan={colSpan}>{noDataText || t('common.noResults')}</td>
    </tr>
  );
};

export default NoDataRow;
