import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import noResultsImage from '../../../../assets/images/jpg/no-results.jpg';
import styles from '../table.module.scss';

type NoResultsProps = {
  noResultsText?: string;
};

const NoResults: FC<NoResultsProps> = ({ noResultsText }) => {
  const { t } = useTranslation();

  const renderWrapper = () => {
    return (
      <div className={styles.wrapper}>
        <div>{noResultsText ?? t('common.table.noResultsText')}</div>
        <img src={noResultsImage} alt="" />
      </div>
    );
  };

  return <div className={styles.noResults}>{renderWrapper()}</div>;
};

export default NoResults;
