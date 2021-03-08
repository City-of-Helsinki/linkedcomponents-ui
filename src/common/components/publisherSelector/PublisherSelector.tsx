import { SingleSelectProps } from 'hds-react';
import React from 'react';

import { organizationPathBuilder } from '../../../domain/organization/utils';
import useUser from '../../../domain/user/hooks/useUser';
import useUserOrganizations from '../../../domain/user/hooks/useUserOrganizations';
import {
  OrganizationFieldsFragment,
  useOrganizationQuery,
} from '../../../generated/graphql';
import { OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import SingleSelect from '../singleSelect/SingleSelect';

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
  label,
  name,
  publisher,
  value,
  ...rest
}) => {
  const { user } = useUser();
  const { organizations } = useUserOrganizations(user);

  const [
    selectedOrganization,
    setSelectedOrganization,
  ] = React.useState<OptionType | null>(null);

  const { data: organizationData } = useOrganizationQuery({
    skip: !value,
    variables: {
      id: value as string,
      createPath: getPathBuilder(organizationPathBuilder),
    },
  });

  React.useEffect(() => {
    const selectedValue = organizationData?.organization
      ? getOption(organizationData.organization)
      : null;

    setSelectedOrganization(selectedValue);
  }, [organizationData]);

  const options = publisher
    ? [selectedOrganization as OptionType]
    : organizations.map((org) => getOption(org));

  return (
    <SingleSelect
      {...rest}
      clearable={false}
      id={name}
      label={label}
      options={options}
      // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
      // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
      value={selectedOrganization as OptionType | undefined}
    />
  );
};

export default PublisherSelector;
