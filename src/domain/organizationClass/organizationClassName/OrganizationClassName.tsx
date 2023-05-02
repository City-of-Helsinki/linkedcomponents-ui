import React from 'react';

import { useOrganizationClassQuery } from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import { organizationClassPathBuilder } from '../utils';

interface OrganizationClassNameProps {
  id: string;
}

const OrganizationClassName: React.FC<OrganizationClassNameProps> = ({
  id,
}) => {
  const { data: organizationClassData } = useOrganizationClassQuery({
    skip: !id,
    variables: { id, createPath: getPathBuilder(organizationClassPathBuilder) },
  });

  return (
    <>{getValue(organizationClassData?.organizationClass?.name || id, '-')}</>
  );
};

export default OrganizationClassName;
