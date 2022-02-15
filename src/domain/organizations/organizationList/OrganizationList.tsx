import orderBy from 'lodash/orderBy';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import SearchInput from '../../../common/components/searchInput/SearchInput';
import { OrganizationFieldsFragment } from '../../../generated/graphql';
import useAllOrganizations from '../../organization/hooks/useAllOrganizations';
import {
  DEFAULT_ORGANIZATION_SORT,
  ORGANIZATION_SORT_OPTIONS,
} from '../constants';
import useOrganizationSortOptions from '../hooks/useOrganizationSortOptions';
import OrganizationsTable from '../organizationsTable/OrganizationsTable';
import {
  getOrganizationSearchInitialValues,
  replaceParamsToOrganizationQueryString,
} from '../utils';
import styles from './organizationList.module.scss';

export const testIds = {
  resultList: 'organization-result-list',
};

type OrganizationListProps = {
  onSortChange: (sort: ORGANIZATION_SORT_OPTIONS) => void;
  organizations: OrganizationFieldsFragment[];
  showSubOrganization: boolean;
  sort: ORGANIZATION_SORT_OPTIONS;
  sortedOrganizations: OrganizationFieldsFragment[];
};

const OrganizationList: React.FC<OrganizationListProps> = ({
  onSortChange,
  organizations,
  showSubOrganization = true,
  sort,
  sortedOrganizations,
}) => {
  const { t } = useTranslation();
  const sortOptions = useOrganizationSortOptions();

  const getTableCaption = () => {
    return t(`organizationsPage.organizationsTableCaption`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  return (
    <div>
      <div className={styles.table}>
        <OrganizationsTable
          caption={getTableCaption()}
          organizations={organizations}
          setSort={onSortChange}
          showSubOrganization={showSubOrganization}
          sort={sort as ORGANIZATION_SORT_OPTIONS}
          sortedOrganizations={sortedOrganizations}
        />
      </div>
    </div>
  );
};

const OrganizationListContainer: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [organizationListId] = React.useState(() =>
    uniqueId('organization-list-')
  );
  const { t } = useTranslation();
  const { sort, text } = getOrganizationSearchInitialValues(location.search);
  const [search, setSearch] = React.useState(text);

  const handleSearchChange = (text: string) => {
    history.push({
      pathname: location.pathname,
      search: replaceParamsToOrganizationQueryString(location.search, {
        text,
      }),
    });
  };

  const handleSortChange = (val: ORGANIZATION_SORT_OPTIONS) => {
    history.push({
      pathname: location.pathname,
      search: replaceParamsToOrganizationQueryString(location.search, {
        sort:
          val !== DEFAULT_ORGANIZATION_SORT
            ? val
            : /* istanbul ignore next */ null,
      }),
    });
  };

  const { loading: loadingOrganizations, organizations } =
    useAllOrganizations();
  const sortedOrganizations = orderBy(
    organizations,
    [sort.replace('-', '')],
    [sort.startsWith('-') ? 'desc' : 'asc']
  ) as OrganizationFieldsFragment[];
  const filteredOrganizations = sortedOrganizations.filter((o) =>
    o.name?.toLowerCase().includes(text.toLowerCase())
  );

  const rootOrganizations = sortedOrganizations.filter(
    (o) => !o.parentOrganization
  );
  /* istanbul ignore next */
  const organizationsCount =
    (text ? filteredOrganizations.length : sortedOrganizations.length) || 0;

  return (
    <div id={organizationListId} data-testid={testIds.resultList}>
      <div className={styles.searchRow}>
        <span className={styles.count}>
          {t('organizationsPage.count', { count: organizationsCount })}
        </span>
        <SearchInput
          className={styles.searchInput}
          label={t('organizationsPage.labelSearch')}
          hideLabel
          onSearch={handleSearchChange}
          setValue={setSearch}
          value={search}
        />
      </div>

      <LoadingSpinner isLoading={loadingOrganizations}>
        <OrganizationList
          onSortChange={handleSortChange}
          organizations={text ? filteredOrganizations : rootOrganizations}
          showSubOrganization={!text}
          sort={sort}
          sortedOrganizations={sortedOrganizations}
        />
      </LoadingSpinner>
    </div>
  );
};

export default OrganizationListContainer;
