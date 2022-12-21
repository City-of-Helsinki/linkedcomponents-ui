import {
  Pagination as HdsPagination,
  PaginationProps as HdsPaginationProps,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import useLocale from '../../../hooks/useLocale';

export type PaginationProps = Omit<HdsPaginationProps, 'paginationAriaLabel'>;

const Pagination: React.FC<PaginationProps> = (props) => {
  const locale = useLocale();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <HdsPagination
      {...props}
      language={locale}
      paginationAriaLabel={t('common.paginationAriaLabel')}
      theme={theme.pagination}
    />
  );
};

export default Pagination;
