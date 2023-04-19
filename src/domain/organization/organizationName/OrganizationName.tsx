import React from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
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
import styles from './organizationName.module.scss';

interface OrganizationNameProps {
  organization?: OrganizationFieldsFragment;
  withIcon?: boolean;
}

const OrganizationName: React.FC<OrganizationNameProps> = ({
  organization,
  withIcon,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const fields = organization
    ? getOrganizationFields(organization, locale, t)
    : null;
  const name = fields?.name;

  return withIcon ? (
    <TextWithIcon
      icon={name && <OrganizationBadge name={name} />}
      text={name ?? '-'}
    />
  ) : (
    <span title={name}>{name ?? '-'}</span>
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
  const { data: organizationData, loading } = useOrganizationQuery({
    skip: !id,
    variables: {
      id: getValue(id, ''),
      createPath: getPathBuilder(organizationPathBuilder),
    },
  });

  return (
    <LoadingSpinner className={styles.loadingSpinner} isLoading={loading} small>
      <OrganizationName
        organization={organizationData?.organization}
        withIcon={withIcon}
      />
    </LoadingSpinner>
  );
};

export default OrganizationNameContainer;
