import React from 'react';
import { useTranslation } from 'react-i18next';

import useAllOrganizationClasses from '../../../domain/organizationClass/hooks/useAllOrganizationClasses';
import {
  getOrganizationClassFields,
  organizationClassPathBuilder,
} from '../../../domain/organizationClass/utils';
import {
  OrganizationClassFieldsFragment,
  useOrganizationClassQuery,
} from '../../../generated/graphql';
import { OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import Combobox, { SingleComboboxProps } from '../combobox/Combobox';

const getOption = ({
  organizationClass,
}: {
  organizationClass: OrganizationClassFieldsFragment;
}): OptionType => {
  const { id: value, name: label } =
    getOrganizationClassFields(organizationClass);

  return { label, value };
};

export type SingleOrganizationClassSelectorProps = SingleComboboxProps<
  string | null
>;

const SingleOrganizationClassSelector: React.FC<
  SingleOrganizationClassSelectorProps
> = ({ label, name, value, ...rest }) => {
  const { t } = useTranslation();

  const { organizationClasses } = useAllOrganizationClasses();

  const options: OptionType[] = React.useMemo(
    () =>
      organizationClasses.map((organizationClass) =>
        getOption({ organizationClass })
      ) ?? /* istanbul ignore next */ [],
    [organizationClasses]
  );

  const { data: organizationClassData } = useOrganizationClassQuery({
    skip: !value,
    variables: {
      id: value as string,
      createPath: getPathBuilder(organizationClassPathBuilder),
    },
  });

  const selectedOrganizationClass = React.useMemo(() => {
    const organizationClass = organizationClassData?.organizationClass;
    return organizationClass ? getOption({ organizationClass }) : null;
  }, [organizationClassData]);

  return (
    <Combobox
      {...rest}
      multiselect={false}
      id={name}
      label={label}
      options={options}
      toggleButtonAriaLabel={t('common.combobox.toggleButtonAriaLabel')}
      // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
      // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
      value={selectedOrganizationClass as OptionType | undefined}
    />
  );
};

export default SingleOrganizationClassSelector;
