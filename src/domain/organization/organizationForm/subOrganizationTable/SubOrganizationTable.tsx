import orderBy from 'lodash/orderBy';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import LoadingSpinner from '../../../../common/components/loadingSpinner/LoadingSpinner';
import Table from '../../../../common/components/table/Table';
import { OrganizationFieldsFragment } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import formatDate from '../../../../utils/formatDate';
import getSortByOrderAndColKey from '../../../../utils/getSortByOrderAndColKey';
import getSortOrderAndKey from '../../../../utils/getSortOrderAndKey';
import getValue from '../../../../utils/getValue';
import useOrganizationSortOptions from '../../../organizations/hooks/useOrganizationSortOptions';
import { ORGANIZATION_FIELDS } from '../../constants';
import useAllOrganizations from '../../hooks/useAllOrganizations';
import { getOrganizationFields } from '../../utils';
import styles from './subOrganizationTable.module.scss';

type ColumnProps = {
  organization: OrganizationFieldsFragment;
};

const NameColumn: FC<ColumnProps> = ({ organization }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { fullName, organizationUrl } = getOrganizationFields(
    organization,
    locale,
    t
  );

  return <Link to={organizationUrl}>{fullName}</Link>;
};

const FoundingDateColumn: FC<ColumnProps> = ({ organization }) => {
  const locale = useLocale();
  const { t } = useTranslation();
  const { foundingDate } = getOrganizationFields(organization, locale, t);

  return (
    <>
      {foundingDate ? formatDate(foundingDate) : /* istanbul ignore next */ '-'}
    </>
  );
};

const ClassificationColumn: FC<ColumnProps> = ({ organization }) => {
  const locale = useLocale();
  const { t } = useTranslation();
  const { classification } = getOrganizationFields(organization, locale, t);

  return <>{getValue(classification, '-')}</>;
};

const DataSourceColumn: FC<ColumnProps> = ({ organization }) => {
  const locale = useLocale();
  const { t } = useTranslation();
  const { dataSource } = getOrganizationFields(organization, locale, t);

  return <>{getValue(dataSource, '-')}</>;
};

const OriginIdColumn: FC<ColumnProps> = ({ organization }) => {
  const locale = useLocale();
  const { t } = useTranslation();
  const { originId } = getOrganizationFields(organization, locale, t);

  return <>{getValue(originId, '-')}</>;
};

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
    [sort.replace(/-/g, '')],
    [sort.startsWith('-') ? 'desc' : 'asc']
  );

  const getTableCaption = () => {
    return t(`organization.subOrganizationsTableCaption`, {
      title,
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  const { initialSortingColumnKey, initialSortingOrder } = useMemo(() => {
    const { colKey, order } = getSortOrderAndKey(sort);

    return {
      initialSortingColumnKey: colKey,
      initialSortingOrder: order,
    };
  }, [sort]);

  const MemoizedNameColumn = React.useCallback(
    (organization: OrganizationFieldsFragment) => (
      <NameColumn organization={organization} />
    ),
    []
  );
  const MemoizedFoundingDateColumn = React.useCallback(
    (organization: OrganizationFieldsFragment) => (
      <FoundingDateColumn organization={organization} />
    ),
    []
  );
  const MemoizedClassificationColumn = React.useCallback(
    (organization: OrganizationFieldsFragment) => (
      <ClassificationColumn organization={organization} />
    ),
    []
  );
  const MemoizedDataSourceColumn = React.useCallback(
    (organization: OrganizationFieldsFragment) => (
      <DataSourceColumn organization={organization} />
    ),
    []
  );
  const MemoizedOriginIdColumn = React.useCallback(
    (organization: OrganizationFieldsFragment) => (
      <OriginIdColumn organization={organization} />
    ),
    []
  );

  return (
    <div className={styles.subOrganizationTable}>
      <h2 className={styles.title}>{title}</h2>
      <Table
        caption={getTableCaption()}
        cols={[
          {
            isSortable: true,
            key: ORGANIZATION_FIELDS.NAME,
            headerName: t('organization.form.labelName'),
            sortIconType: 'string',
            transform: MemoizedNameColumn,
          },
          {
            isSortable: true,
            key: ORGANIZATION_FIELDS.FOUNDING_DATE,
            headerName: t('organization.form.labelFoundingDate'),
            sortIconType: 'other',
            transform: MemoizedFoundingDateColumn,
          },
          {
            isSortable: true,
            key: ORGANIZATION_FIELDS.CLASSIFICATION,
            headerName: t('organization.form.labelClassification'),
            sortIconType: 'string',
            transform: MemoizedClassificationColumn,
          },
          {
            isSortable: true,
            key: ORGANIZATION_FIELDS.DATA_SOURCE,
            headerName: t('organization.form.labelDataSource'),
            sortIconType: 'string',
            transform: MemoizedDataSourceColumn,
          },
          {
            isSortable: true,
            key: ORGANIZATION_FIELDS.ID,
            headerName: t('organization.form.labelOriginId'),
            sortIconType: 'string',
            transform: MemoizedOriginIdColumn,
          },
        ]}
        indexKey="id"
        initialSortingColumnKey={initialSortingColumnKey}
        initialSortingOrder={initialSortingOrder}
        onSort={(order, colKey, handleSort) => {
          setSort(getSortByOrderAndColKey({ order, colKey }));
          handleSort();
        }}
        rows={sortedOrganizations}
        showNoResultsRow={!loading}
        variant="light"
      />
      {loading && <LoadingSpinner small isLoading={true} />}
    </div>
  );
};

export default SubOrganizationTable;
