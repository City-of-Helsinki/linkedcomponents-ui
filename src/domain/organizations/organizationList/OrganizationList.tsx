import orderBy from 'lodash/orderBy';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { PAGE_SIZE } from '../../../common/components/imageSelector/constants';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import TableWrapper from '../../../common/components/table/tableWrapper/TableWrapper';
import { testIds } from '../../../constants';
import { OrganizationFieldsFragment } from '../../../generated/graphql';
import useCommonListProps from '../../../hooks/useCommonListProps';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import AdminSearchRow from '../../admin/layout/adminSearchRow/AdminSearchRow';
import useAllOrganizations from '../../organization/hooks/useAllOrganizations';
import { DEFAULT_ORGANIZATION_SORT } from '../constants';
import useOrganizationSortOptions from '../hooks/useOrganizationSortOptions';
import OrganizationsTable from '../organizationsTable/OrganizationsTable';
import { getOrganizationSearchInitialValues } from '../utils';

const OrganizationList: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { sort, text } = getOrganizationSearchInitialValues(location.search);
  const [search, setSearch] = React.useState(text);

  const organizationListId = useIdWithPrefix({ prefix: 'organization-list-' });

  const { loading: loadingOrganizations, organizations } =
    useAllOrganizations();

  const sortedOrganizations = orderBy(
    organizations,
    [sort.replace(/-/g, '')],
    [sort.startsWith('-') ? 'desc' : 'asc']
  ) as OrganizationFieldsFragment[];

  const filteredOrganizations = sortedOrganizations.filter(
    (o) =>
      o.name?.toLowerCase().includes(text.toLowerCase()) ||
      o.id?.toLowerCase().includes(text.toLowerCase())
  );

  const rootOrganizations = sortedOrganizations.filter(
    (o) => !o.parentOrganization
  );
  /* istanbul ignore next */
  const organizationsCount = filteredOrganizations.length || 0;
  const { onSearchSubmit, onSortChange } = useCommonListProps({
    defaultSort: DEFAULT_ORGANIZATION_SORT,
    listId: organizationListId,
    meta: undefined,
    pageSize: PAGE_SIZE,
  });

  const sortOptions = useOrganizationSortOptions();

  const getTableCaption = () => {
    return t(`organizationsPage.organizationsTableCaption`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  return (
    <div
      id={organizationListId}
      data-testid={testIds.organizationList.resultList}
    >
      <AdminSearchRow
        countText={t('organizationsPage.count', { count: organizationsCount })}
        searchInputLabel={t('organizationsPage.labelSearch')}
        onSearchChange={setSearch}
        onSearchSubmit={onSearchSubmit}
        searchValue={search}
      />

      <LoadingSpinner isLoading={loadingOrganizations}>
        <TableWrapper>
          <OrganizationsTable
            caption={getTableCaption()}
            organizations={text ? filteredOrganizations : rootOrganizations}
            setSort={onSortChange}
            showSubOrganizations={!text}
            sort={sort}
            sortedOrganizations={sortedOrganizations}
          />
        </TableWrapper>
      </LoadingSpinner>
    </div>
  );
};

export default OrganizationList;
