/* eslint-disable max-len */
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccessibilityNotificationContext } from '../accessibilityNotificationContext/hooks/useAccessibilityNotificationContext';

type Props = { count: number; loading: boolean };

const SearchStatus: FC<Props> = ({ count, loading }) => {
  const { t } = useTranslation();
  const { setAccessibilityText } = useAccessibilityNotificationContext();

  useEffect(() => {
    if (!loading) {
      setAccessibilityText(
        count
          ? t('common.table.accessibility.resultsFoundText', { count })
          : t('common.table.accessibility.noResultsFound')
      );
    }
  }, [count, loading, setAccessibilityText, t]);
  return null;
};

export default SearchStatus;
