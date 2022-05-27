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
    skip: !id,
    variables: { id, createPath: getPathBuilder(organizationClassPathBuilder) },
  });

  return (
    <>
      {
        /* istanbul ignore next*/
        organizationClassData?.organizationClass?.name || id || '-'
      }
    </>
  );
};

export default OrganizationClassName;
