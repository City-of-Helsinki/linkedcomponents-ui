import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import Table from '../../../common/components/table/Table';
import {
  PriceGroupFieldsFragment,
  PriceGroupsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getSortByOrderAndColKey from '../../../utils/getSortByOrderAndColKey';
import getSortOrderAndKey from '../../../utils/getSortOrderAndKey';
import OrganizationName from '../../organization/organizationName/OrganizationName';
import {
  getPriceGroupFields,
  getPriceGroupItemId,
} from '../../priceGroup/utils';
import { PRICE_GROUP_SORT_OPTIONS } from '../constants';
import PriceGroupActionsDropdown from '../priceGroupActionsDropdown/PriceGroupActionsDropdown';
import { getBooleanText } from '../utils';

export interface PriceGroupsTableProps {
  caption: string;
  priceGroups: PriceGroupsQuery['priceGroups']['data'];
  setSort: (sort: PRICE_GROUP_SORT_OPTIONS) => void;
  sort: PRICE_GROUP_SORT_OPTIONS;
}

type ColumnProps = {
  priceGroup: PriceGroupFieldsFragment;
};

const IdColumn = ({ priceGroup }: ColumnProps) => {
  const locale = useLocale();
  const { id, priceGroupUrl } = getPriceGroupFields(priceGroup, locale);

  return (
    <Link id={getPriceGroupItemId(id)} to={priceGroupUrl}>
      {id}
    </Link>
  );
};

const PublisherColumn = ({ priceGroup }: ColumnProps) => {
  const locale = useLocale();
  const { publisher } = getPriceGroupFields(priceGroup, locale);
  return <OrganizationName id={publisher} />;
};

const DescriptionColumn = ({ priceGroup }: ColumnProps) => {
  const locale = useLocale();
  const { description } = getPriceGroupFields(priceGroup, locale);

  return description;
};

const IsFreeColumn = ({ priceGroup }: ColumnProps) => {
  const locale = useLocale();
  const { t } = useTranslation();
  const { isFree } = getPriceGroupFields(priceGroup, locale);

  return getBooleanText(isFree, t);
};

const ActionsColumn = ({ priceGroup }: ColumnProps) => {
  return <PriceGroupActionsDropdown priceGroup={priceGroup} />;
};

const PriceGroupsTable: React.FC<PriceGroupsTableProps> = ({
  caption,
  priceGroups,
  setSort,
  sort,
}) => {
  const { t } = useTranslation();

  const handleSortChange = (key: string) => {
    setSort(key as PRICE_GROUP_SORT_OPTIONS);
  };

  const { initialSortingColumnKey, initialSortingOrder } = useMemo(() => {
    const { colKey, order } = getSortOrderAndKey(sort);

    return {
      initialSortingColumnKey: colKey,
      initialSortingOrder: order,
    };
  }, [sort]);

  const MemoizedIdColumn = React.useCallback(
    (priceGroup: PriceGroupFieldsFragment) => (
      <IdColumn priceGroup={priceGroup} />
    ),
    []
  );
  const MemoizedPublisherColumn = React.useCallback(
    (priceGroup: PriceGroupFieldsFragment) => (
      <PublisherColumn priceGroup={priceGroup} />
    ),
    []
  );
  const MemoizedDescriptionColumn = React.useCallback(
    (priceGroup: PriceGroupFieldsFragment) => (
      <DescriptionColumn priceGroup={priceGroup} />
    ),
    []
  );
  const MemoizedIsFreeColumn = React.useCallback(
    (priceGroup: PriceGroupFieldsFragment) => (
      <IsFreeColumn priceGroup={priceGroup} />
    ),
    []
  );
  const MemoizedActionsColumn = React.useCallback(
    (priceGroup: PriceGroupFieldsFragment) => (
      <ActionsColumn priceGroup={priceGroup} />
    ),
    []
  );

  return (
    <Table
      caption={caption}
      cols={[
        {
          key: 'id',
          headerName: t('priceGroupsPage.priceGroupsTableColumns.id'),
          transform: MemoizedIdColumn,
        },
        {
          key: 'publisher',
          headerName: t('priceGroupsPage.priceGroupsTableColumns.publisher'),
          transform: MemoizedPublisherColumn,
        },
        {
          isSortable: true,
          key: 'description',
          headerName: t('priceGroupsPage.priceGroupsTableColumns.description'),
          sortIconType: 'other',
          transform: MemoizedDescriptionColumn,
        },
        {
          key: 'isFree',
          headerName: t('priceGroupsPage.priceGroupsTableColumns.isFree'),
          transform: MemoizedIsFreeColumn,
        },
        {
          key: '',
          headerName: '',
          transform: MemoizedActionsColumn,
        },
      ]}
      hasActionButtons
      indexKey="id"
      initialSortingColumnKey={initialSortingColumnKey}
      initialSortingOrder={initialSortingOrder}
      onSort={(order, colKey, handleSort) => {
        handleSortChange(getSortByOrderAndColKey({ order, colKey }));
        handleSort();
      }}
      rows={priceGroups as PriceGroupFieldsFragment[]}
      variant="light"
    />
  );
};

export default PriceGroupsTable;
