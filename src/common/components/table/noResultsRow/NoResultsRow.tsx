import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import noResultsImage from '../../../../assets/images/jpg/no-results.jpg';
import styles from '../table.module.scss';

type NoResultsRowProps = {
  colSpan: number;
  noResultsText?: string;
};

const NoResultsRow: FC<NoResultsRowProps> = ({ colSpan, noResultsText }) => {
  const { t } = useTranslation();

  return (
    <tr className={styles.noResultsRow}>
      <td colSpan={colSpan}>
        <div className={styles.wrapper}>
          <div>{noResultsText || t('common.table.noResultsText')}</div>
          <img src={noResultsImage} alt="" />
        </div>
      </td>
    </tr>
  );
};

export default NoResultsRow;
