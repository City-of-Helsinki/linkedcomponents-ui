import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import CustomTable from '../../../common/components/table/CustomTable';
import HeaderRow from '../../../common/components/table/headerRow/HeaderRow';
import { SortingHeaderCell } from '../../../common/components/table/sortingHeaderCell/SortingHeaderCell';
import TableBody from '../../../common/components/table/tableBody/TableBody';
import { OrganizationFieldsFragment } from '../../../generated/graphql';
import getSortByColKey from '../../../utils/getSortByColKey';
import getSortOrderAndKey from '../../../utils/getSortOrderAndKey';
import { ORGANIZATION_SORT_OPTIONS } from '../constants';
import styles from './organizationsTable.module.scss';
import OrganizationsTableContext from './OrganizationsTableContext';
import OrganizationsTableRow from './organizationsTableRow/OrganizationsTableRow';

export interface OrganizationsTableProps {
  caption: string;
  className?: string;
  organizations: OrganizationFieldsFragment[];
  setSort: (sort: ORGANIZATION_SORT_OPTIONS) => void;
  showSubOrganizations: boolean;
  sort: ORGANIZATION_SORT_OPTIONS;
  sortedOrganizations: OrganizationFieldsFragment[];
}

const OrganizationsTable: React.FC<OrganizationsTableProps> = ({
  caption,
  className,
  organizations,
  setSort,
  showSubOrganizations,
  sort,
  sortedOrganizations,
}) => {
  const { t } = useTranslation();

  const handleSort = (key: string) => {
    setSort(key as ORGANIZATION_SORT_OPTIONS);
  };

  const getColumnSortingOrder = (colKey: string) => {
    const { colKey: currentColKey, order } = getSortOrderAndKey(sort);

    return currentColKey === colKey ? order : 'unset';
  };

  const setSortingAndOrder = (colKey: string): void => {
    handleSort(getSortByColKey({ colKey, sort }));
  };

  const value = useMemo(
    () => ({ showSubOrganizations, sortedOrganizations }),
    [showSubOrganizations, sortedOrganizations]
  );
  return (
    <OrganizationsTableContext.Provider value={value}>
      <CustomTable
        className={className}
        caption={caption}
        hasActionButtons
        showNoResults={!organizations.length}
        variant="light"
      >
        <thead>
          <HeaderRow>
            <SortingHeaderCell
              className={styles.nameColumn}
              colKey={ORGANIZATION_SORT_OPTIONS.NAME}
              title={t('organizationsPage.organizationsTableColumns.name')}
              order={getColumnSortingOrder(ORGANIZATION_SORT_OPTIONS.NAME)}
              setSortingAndOrder={setSortingAndOrder}
              sortIconType={'string'}
            />
            <SortingHeaderCell
              className={styles.idColumn}
              colKey={ORGANIZATION_SORT_OPTIONS.ID}
              title={t('organizationsPage.organizationsTableColumns.id')}
              order={getColumnSortingOrder(ORGANIZATION_SORT_OPTIONS.ID)}
              setSortingAndOrder={setSortingAndOrder}
              sortIconType={'string'}
            />
            <SortingHeaderCell
              className={styles.dataSourceColumn}
              colKey={ORGANIZATION_SORT_OPTIONS.DATA_SOURCE}
              title={t(
                'organizationsPage.organizationsTableColumns.dataSource'
              )}
              order={getColumnSortingOrder(
                ORGANIZATION_SORT_OPTIONS.DATA_SOURCE
              )}
              setSortingAndOrder={setSortingAndOrder}
              sortIconType={'other'}
            />
            <SortingHeaderCell
              className={styles.classificationColumn}
              colKey={ORGANIZATION_SORT_OPTIONS.CLASSIFICATION}
              title={t(
                'organizationsPage.organizationsTableColumns.classification'
              )}
              order={getColumnSortingOrder(
                ORGANIZATION_SORT_OPTIONS.CLASSIFICATION
              )}
              setSortingAndOrder={setSortingAndOrder}
              sortIconType={'other'}
            />
            <SortingHeaderCell
              className={styles.parentColumn}
              colKey={ORGANIZATION_SORT_OPTIONS.PARENT_ORGANIZATION}
              title={t(
                'organizationsPage.organizationsTableColumns.parentOrganization'
              )}
              order={getColumnSortingOrder(
                ORGANIZATION_SORT_OPTIONS.PARENT_ORGANIZATION
              )}
              setSortingAndOrder={setSortingAndOrder}
              sortIconType={'other'}
            />
            <th></th>
          </HeaderRow>
        </thead>
        <TableBody>
          {organizations.map((organization) => (
            <OrganizationsTableRow
              key={organization?.id}
              organization={organization}
            />
          ))}
        </TableBody>
      </CustomTable>
    </OrganizationsTableContext.Provider>
  );
};

export default OrganizationsTable;
