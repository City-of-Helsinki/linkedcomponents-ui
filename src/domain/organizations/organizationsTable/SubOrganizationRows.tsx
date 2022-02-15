import React from 'react';
import { useTranslation } from 'react-i18next';

import { OrganizationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { getOrganizationFields } from '../../organization/utils';
import OrganizationsTableRow from './OrganizationsTableRow';

interface Props {
  level: number;
  onRowClick: (organization: OrganizationFieldsFragment) => void;
  organizationId: string;
  showSubOrganization: boolean;
  sortedOrganizations: OrganizationFieldsFragment[];
}

const SubOrganizationRows: React.FC<Props> = ({
  level,
  onRowClick,
  organizationId,
  showSubOrganization = true,
  sortedOrganizations,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const organization = sortedOrganizations.find((o) => o.id === organizationId);
  const { affiliatedOrganizations, subOrganizations } = organization
    ? getOrganizationFields(organization, locale, t)
    : { affiliatedOrganizations: [], subOrganizations: [] };
  const subOrganizationIds = [...affiliatedOrganizations, ...subOrganizations];
  const subOrganizationsObjects = sortedOrganizations.filter((o) =>
    subOrganizationIds.includes(o.atId)
  );

  if (!showSubOrganization) {
    return null;
  }

  return (
    <>
      {subOrganizationsObjects.map((subOrganization) => {
        return (
          subOrganization && (
            <OrganizationsTableRow
              key={subOrganization.id}
              level={level + 1}
              onRowClick={onRowClick}
              organization={subOrganization}
              showSubOrganization={showSubOrganization}
              sortedOrganizations={sortedOrganizations}
            />
          )
        );
      })}
    </>
  );
};

export default SubOrganizationRows;
