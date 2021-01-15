import React from 'react';

import {
  OrganizationFieldsFragment,
  useOrganizationQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import {
  getOrganizationFields,
  organizationPathBuilder,
} from '../../organization/utils';

interface PublisherNameProps {
  organization: OrganizationFieldsFragment;
}

const PublisherName: React.FC<PublisherNameProps> = ({ organization }) => {
  const { name } = getOrganizationFields(organization);

  return <>{name}</>;
};

interface PublisherNameContainerProps {
  id: string;
}

const PublisherNameContainer: React.FC<PublisherNameContainerProps> = ({
  id,
}) => {
  const { data: organizationData } = useOrganizationQuery({
    variables: { id, createPath: getPathBuilder(organizationPathBuilder) },
  });

  return (
    <>
      {organizationData?.organization ? (
        <PublisherName organization={organizationData.organization} />
      ) : (
        '-'
      )}
    </>
  );
};

export default PublisherNameContainer;
