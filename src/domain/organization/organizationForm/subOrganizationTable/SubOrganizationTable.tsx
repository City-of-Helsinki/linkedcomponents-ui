import orderBy from 'lodash/orderBy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../../../common/components/loadingSpinner/LoadingSpinner';
import NoDataRow from '../../../../common/components/table/NoDataRow';
import SortableColumn from '../../../../common/components/table/SortableColumn';
import Table from '../../../../common/components/table/Table';
import useSetFocused from '../../../../hooks/useSetFocused';
import useOrganizationSortOptions from '../../../organizations/hooks/useOrganizationSortOptions';
import { ORGANIZATION_FIELDS } from '../../constants';
import useAllOrganizations from '../../hooks/useAllOrganizations';
import styles from './subOrganizationTable.module.scss';
import SubOrganizationTableRow from './SubOrganizationTableRow';

export type SubOrganizationTableProps = {
  organizationIds: string[];
  title: string;
};

const SubOrganizationTable: React.FC<SubOrganizationTableProps> = ({
  organizationIds,
  title,
}) => {
  const { t } = useTranslation();
  const sortOptions = useOrganizationSortOptions();
  const [sort, setSort] = React.useState<string>(ORGANIZATION_FIELDS.NAME);
  const { loading, organizations: allOrganizations } = useAllOrganizations();
  const organizations = allOrganizations.filter((o) =>
    organizationIds.includes(o.atId)
  );
  const sortedOrganizations = orderBy(
    organizations,
    [sort.replace('-', '')],
    [sort.startsWith('-') ? 'desc' : 'asc']
  );
  const table = React.useRef<HTMLTableElement>(null);
  const { focused } = useSetFocused(table);

  const getTableCaption = () => {
    return t(`organization.subOrganizationsTableCaption`, {
      title,
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  return (
    <div className={styles.subOrganizationTable}>
      <h2 className={styles.title}>{title}</h2>
      <Table ref={table}>
        <caption aria-live={focused ? 'polite' : undefined}>
          {getTableCaption()}
        </caption>
        <thead>
          <tr>
            <SortableColumn
              className={styles.nameColumn}
              label={t('organization.form.labelName')}
              onClick={setSort}
              sort={sort}
              sortKey={ORGANIZATION_FIELDS.NAME}
              type="text"
            />
            <SortableColumn
              className={styles.foundingDateColumn}
              label={t('organization.form.labelFoundingDate')}
              onClick={setSort}
              sort={sort}
              sortKey={ORGANIZATION_FIELDS.FOUNDING_DATE}
              type="default"
            />
            <SortableColumn
              className={styles.classificationColumn}
              label={t('organization.form.labelClassification')}
              onClick={setSort}
              sort={sort}
              sortKey={ORGANIZATION_FIELDS.CLASSIFICATION}
              type="default"
            />
            <SortableColumn
              className={styles.dataSourceColumn}
              label={t('organization.form.labelDataSource')}
              onClick={setSort}
              sort={sort}
              sortKey={ORGANIZATION_FIELDS.DATA_SOURCE}
              type="text"
            />
            <SortableColumn
              className={styles.originIdColumn}
              label={t('organization.form.labelOriginId')}
              onClick={setSort}
              sort={sort}
              sortKey={ORGANIZATION_FIELDS.ID}
              type="text"
            />

            <th className={styles.actionButtonsColumn}></th>
          </tr>
        </thead>

        <tbody>
          {!!organizationIds.length && loading ? (
            <tr>
              <td colSpan={5}>
                <LoadingSpinner small isLoading={true} />
              </td>
            </tr>
          ) : (
            <>
              {sortedOrganizations.map(
                (organization) =>
                  organization && (
                    <SubOrganizationTableRow
                      key={organization.atId}
                      organization={organization}
                    />
                  )
              )}
              {!sortedOrganizations.length && <NoDataRow colSpan={5} />}
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default SubOrganizationTable;
