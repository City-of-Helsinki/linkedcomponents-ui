import React from 'react';
import { useTranslation } from 'react-i18next';

import TextWithIcon from '../../../common/components/textWithIcon/TextWithIcon';
import {
  OrganizationFieldsFragment,
  useOrganizationQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import OrganizationBadge from '../organizationBadge/OrganizationBadge';
import { getOrganizationFields, organizationPathBuilder } from '../utils';

interface OrganizationNameProps {
  organization: OrganizationFieldsFragment;
  withIcon?: boolean;
}

const OrganizationName: React.FC<OrganizationNameProps> = ({
  organization,
  withIcon,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { name } = getOrganizationFields(organization, locale, t);

  return withIcon ? (
    <TextWithIcon icon={<OrganizationBadge name={name} />} text={name} />
  ) : (
    <span title={name}>{name}</span>
  );
};

interface OrganizationNameContainerProps {
  id: string | null;
  withIcon?: boolean;
}

const OrganizationNameContainer: React.FC<OrganizationNameContainerProps> = ({
  id,
  withIcon,
}) => {
  const { data: organizationData } = useOrganizationQuery({
    skip: !id,
    variables: {
      id: getValue(id, ''),
      createPath: getPathBuilder(organizationPathBuilder),
    },
  });

  if (organizationData?.organization) {
    return (
      <OrganizationName
        organization={organizationData.organization}
        withIcon={withIcon}
      />
    );
  }

  return withIcon ? (
    <TextWithIcon icon={<OrganizationBadge name="" />} text={'-'} />
  ) : (
    <span>-</span>
  );
};

export default OrganizationNameContainer;
