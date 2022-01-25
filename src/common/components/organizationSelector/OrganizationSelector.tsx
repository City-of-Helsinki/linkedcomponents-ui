import { SingleSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  getOrganizationFields,
  organizationPathBuilder,
  organizationsPathBuilder,
} from '../../../domain/organization/utils';
import {
  OrganizationFieldsFragment,
  useOrganizationQuery,
  useOrganizationsQuery,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import Combobox from '../combobox/Combobox';

const getOption = (organization: OrganizationFieldsFragment): OptionType => {
  const { id: value, name: label } = getOrganizationFields(organization);

  return { label, value };
};

type ValueType = string | null;

export type OrganizationSelectorProps = {
  name: string;
  value: ValueType;
} & Omit<SingleSelectProps<OptionType>, 'options' | 'value'>;

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  label,
  name,
  value,
  ...rest
}) => {
  const timer = React.useRef<number>();
  const { t } = useTranslation();
  const [search, setSearch] = useMountedState('');

  const { data: organizationsData, previousData: previousOrganizationsData } =
    useOrganizationsQuery({
      variables: {
        createPath: getPathBuilder(organizationsPathBuilder),
        text: search,
      },
    });

  const { data: organizationData } = useOrganizationQuery({
    skip: !value,
    variables: {
      id: value as string,
      createPath: getPathBuilder(organizationPathBuilder),
    },
  });

  const handleFilter = (items: OptionType[], inputValue: string) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSearch(inputValue);
    });

    return items;
  };

  const options = React.useMemo(
    () =>
      (organizationsData || previousOrganizationsData)?.organizations?.data.map(
        (organization) => getOption(organization as OrganizationFieldsFragment)
      ) ?? [],
    [organizationsData, previousOrganizationsData]
  );

  React.useEffect(() => {
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedOrganization = React.useMemo(
    () =>
      organizationData?.organization
        ? getOption(organizationData?.organization)
        : null,
    [organizationData]
  );

  return (
    <Combobox
      {...rest}
      multiselect={false}
      filter={handleFilter}
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

export default OrganizationSelector;
