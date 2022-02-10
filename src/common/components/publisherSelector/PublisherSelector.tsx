import { SingleSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { organizationPathBuilder } from '../../../domain/organization/utils';
import useUser from '../../../domain/user/hooks/useUser';
import useUserOrganizations from '../../../domain/user/hooks/useUserOrganizations';
import {
  OrganizationFieldsFragment,
  useOrganizationQuery,
} from '../../../generated/graphql';
import { OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import Combobox from '../combobox/Combobox';

const getOption = (organization: OrganizationFieldsFragment): OptionType => {
  return {
    label: organization.name as string,
    value: organization.id as string,
  };
};

type ValueType = string | null;

export type PublisherSelectorProps = {
  name: string;
  publisher?: string | null;
  value: ValueType;
} & Omit<SingleSelectProps<OptionType>, 'options' | 'value'>;

const PublisherSelector: React.FC<PublisherSelectorProps> = ({
  clearable = false,
  label,
  name,
  publisher,
  value,
  ...rest
}) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { organizations } = useUserOrganizations(user);

  const { data: organizationData } = useOrganizationQuery({
    skip: !value,
    variables: {
      id: value as string,
      createPath: getPathBuilder(organizationPathBuilder),
    },
  });

  const selectedOrganization = React.useMemo(
    () =>
      organizationData?.organization
        ? getOption(organizationData.organization)
        : null,
    [organizationData]
  );

  const options = publisher
    ? selectedOrganization
      ? [selectedOrganization]
      : []
    : organizations.map((org) => getOption(org));

  return (
    <Combobox
      {...rest}
      multiselect={false}
      clearable={clearable}
      id={name}
      label={label}
      options={options}
      toggleButtonAriaLabel={t('common.combobox.toggleButtonAriaLabel')}
      // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
      // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
      value={selectedOrganization as OptionType | undefined}
    />
  );
};

export default PublisherSelector;
