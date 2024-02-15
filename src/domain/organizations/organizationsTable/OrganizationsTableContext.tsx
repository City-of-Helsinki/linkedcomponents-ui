import { createContext } from 'react';

import { OrganizationFieldsFragment } from '../../../generated/graphql';

type OrganizationsTableContext = {
  showSubOrganizations: boolean;
  sortedOrganizations: OrganizationFieldsFragment[];
};

export const organizationsTableContextDefaultValue: OrganizationsTableContext =
  {
    showSubOrganizations: true,
    sortedOrganizations: [],
  };

export default createContext(organizationsTableContextDefaultValue);
