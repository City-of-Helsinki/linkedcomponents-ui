import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import useLocale from '../../../../hooks/useLocale';
import { getOrganizationFields } from '../../../organization/utils';
import OrganizationsTableContext from '../OrganizationsTableContext';
import OrganizationsTableRow from '../organizationsTableRow/OrganizationsTableRow';

interface Props {
  level: number;
  organizationId: string;
}

const SubOrganizationRows: React.FC<Props> = ({ level, organizationId }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { showSubOrganizations, sortedOrganizations } = useContext(
    OrganizationsTableContext
  );
  const organization = sortedOrganizations.find((o) => o.id === organizationId);
  const { affiliatedOrganizations, subOrganizations } = organization
    ? getOrganizationFields(organization, locale, t)
    : /* istanbul ignore next */
      { affiliatedOrganizations: [], subOrganizations: [] };
  const subOrganizationIds = [...affiliatedOrganizations, ...subOrganizations];
  const subOrganizationsObjects = sortedOrganizations.filter((o) =>
    subOrganizationIds.includes(o.atId)
  );

  /* istanbul ignore next */
  if (!showSubOrganizations) {
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
              organization={subOrganization}
            />
          )
        );
      })}
    </>
  );
};

export default SubOrganizationRows;
