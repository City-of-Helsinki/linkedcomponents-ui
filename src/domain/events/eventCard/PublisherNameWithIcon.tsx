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
import PublisherBadge from './PublisherBadge';
import TextWithIcon from './TextWithIcon';

interface PublisherNameWithIconProps {
  organization: OrganizationFieldsFragment;
}

const PublisherNameWithIcon: React.FC<PublisherNameWithIconProps> = ({
  organization,
}) => {
  const { name } = getOrganizationFields(organization);

  return <TextWithIcon icon={<PublisherBadge name={name} />} text={name} />;
};

interface PublisherNameWithIconContainerProps {
  id?: string | null;
}

const PublisherNameWithIconContainer: React.FC<PublisherNameWithIconContainerProps> =
  ({ id }) => {
    const { data: organizationData } = useOrganizationQuery({
      skip: !id,
      variables: {
        id: id as string,
        createPath: getPathBuilder(organizationPathBuilder),
      },
    });

    return organizationData?.organization ? (
      <PublisherNameWithIcon organization={organizationData?.organization} />
    ) : (
      <TextWithIcon icon={<PublisherBadge name="" />} text={'-'} />
    );
  };

export default PublisherNameWithIconContainer;
