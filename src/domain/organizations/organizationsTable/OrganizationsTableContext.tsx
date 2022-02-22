import { createContext } from 'react';

import { OrganizationFieldsFragment } from '../../../generated/graphql';

type OrganizationsTableContext = {
  onRowClick: (organization: OrganizationFieldsFragment) => void;
  showSubOrganizations: boolean;
  sortedOrganizations: OrganizationFieldsFragment[];
};

export const organizationsTableContextDefaultValue: OrganizationsTableContext =
  {
    onRowClick: () => undefined,
    showSubOrganizations: true,
    sortedOrganizations: [],
  };

export default createContext(organizationsTableContextDefaultValue);
