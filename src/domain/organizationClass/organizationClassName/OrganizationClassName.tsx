import React from 'react';

import { useOrganizationClassQuery } from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import { organizationClassPathBuilder } from '../utils';

interface OrganizationClassNameProps {
  id: string;
}

const OrganizationClassName: React.FC<OrganizationClassNameProps> = ({
  id,
}) => {
  const { data: organizationClassData } = useOrganizationClassQuery({
    variables: { id, createPath: getPathBuilder(organizationClassPathBuilder) },
  });

  return (
    <>
      {organizationClassData?.organizationClass.name ||
        id ||
        /* istanbul ignore next*/ '-'}
    </>
  );
};

export default OrganizationClassName;
