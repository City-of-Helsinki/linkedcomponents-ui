import React, { PropsWithChildren } from 'react';
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
  wrapper?: React.FC<PropsWithChildren>;
}

const OrganizationNameContainer: React.FC<OrganizationNameContainerProps> = ({
  id,
  withIcon,
  wrapper,
}) => {
  // the variable name must be capitalized
  const Wrapper = wrapper ?? React.Fragment;

  const { data: organizationData, loading } = useOrganizationQuery({
    skip: !id,
    variables: {
      id: getValue(id, ''),
      createPath: getPathBuilder(organizationPathBuilder),
      dissolved: false,
    },
  });

  return (
    <LoadingSpinner className={styles.loadingSpinner} isLoading={loading} small>
      <Wrapper>
        <OrganizationName
          organization={organizationData?.organization}
          withIcon={withIcon}
        />
      </Wrapper>
    </LoadingSpinner>
  );
};

export default OrganizationNameContainer;
