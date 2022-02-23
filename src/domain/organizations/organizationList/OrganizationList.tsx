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

const OrganizationList: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const [organizationListId] = React.useState(() =>
    uniqueId('organization-list-')
  );
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

  const { loading: loadingOrganizations, organizations } =
    useAllOrganizations();

  const sortedOrganizations = orderBy(
    organizations,
    [sort.replace('-', '')],
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

  const sortOptions = useOrganizationSortOptions();

  const onSortChange = (val: ORGANIZATION_SORT_OPTIONS) => {
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

  const getTableCaption = () => {
    return t(`organizationsPage.organizationsTableCaption`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

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
        <div className={styles.table}>
          <OrganizationsTable
            caption={getTableCaption()}
            organizations={text ? filteredOrganizations : rootOrganizations}
            setSort={onSortChange}
            showSubOrganizations={!text}
            sort={sort as ORGANIZATION_SORT_OPTIONS}
            sortedOrganizations={sortedOrganizations}
          />
        </div>
      </LoadingSpinner>
    </div>
  );
};

export default OrganizationList;