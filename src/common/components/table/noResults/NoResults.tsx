import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import noResultsImage from '../../../../assets/images/jpg/no-results.jpg';
import styles from '../table.module.scss';

type NoResultsProps = {
  colSpan?: number;
  noResultsText?: string;
};

const NoResults: FC<NoResultsProps> = ({ colSpan, noResultsText }) => {
  const { t } = useTranslation();

  const renderWrapper = () => {
    return (
      <div className={styles.wrapper}>
        <div>{noResultsText ?? t('common.table.noResultsText')}</div>
        <img src={noResultsImage} alt="" />
      </div>
    );
  };

  if (colSpan) {
    return (
      <tr className={styles.noResultsRow}>
        <td colSpan={colSpan}>{renderWrapper()}</td>
      </tr>
    );
  }

  return <div className={styles.noResults}>{renderWrapper()}</div>;
};

export default NoResults;
