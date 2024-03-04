import { Table as HdsTable, TableProps as HdsTableProps } from 'hds-react';
import { FC } from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import NoResults from './noResults/NoResults';
import TableWrapper, { TableWrapperProps } from './tableWrapper/TableWrapper';

type TableProps = {
  loading?: boolean;
  noResultsText?: string;
  showNoResultsRow?: boolean;
} & TableWrapperProps &
  HdsTableProps;

const Table: FC<TableProps> = ({
  hasActionButtons,
  inlineWithBackground,
  loading,
  noResultsText,
  rows,
  showNoResultsRow = true,
  variant = 'light',
  wrapperClassName,
  ...props
}) => {
  const { theme } = useTheme();
  return (
    <TableWrapper
      hasActionButtons={hasActionButtons}
      inlineWithBackground={inlineWithBackground}
      wrapperClassName={wrapperClassName}
    >
      <HdsTable
        {...props}
        theme={theme.table.variant?.[variant]}
        rows={loading ? [] : rows}
        variant={variant}
      />
      {loading && <LoadingSpinner isLoading={true} />}
      {!loading && showNoResultsRow && !rows.length && (
        <NoResults noResultsText={noResultsText} />
      )}
    </TableWrapper>
  );
};

export default Table;
