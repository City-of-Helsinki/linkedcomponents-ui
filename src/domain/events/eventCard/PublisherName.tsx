import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  OrganizationFieldsFragment,
  useOrganizationQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getPathBuilder from '../../../utils/getPathBuilder';
import {
  getOrganizationFields,
  organizationPathBuilder,
} from '../../organization/utils';

interface PublisherNameProps {
  organization: OrganizationFieldsFragment;
}

const PublisherName: React.FC<PublisherNameProps> = ({ organization }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { name } = getOrganizationFields(organization, locale, t);

  return <span title={name}>{name}</span>;
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
