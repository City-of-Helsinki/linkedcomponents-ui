import { Option } from 'hds-react';
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
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import Combobox, { SingleComboboxProps } from '../combobox/Combobox';

const getOption = ({
  organizationClass,
}: {
  organizationClass: OrganizationClassFieldsFragment;
}): Partial<Option> => {
  const { id: value, name: label } =
    getOrganizationClassFields(organizationClass);

  return { label, value };
};

export type SingleOrganizationClassSelectorProps = SingleComboboxProps<
  string | null
>;

const SingleOrganizationClassSelector: React.FC<
  SingleOrganizationClassSelectorProps
> = ({ texts, name, value, ...rest }) => {
  const { t } = useTranslation();

  const { loading, organizationClasses } = useAllOrganizationClasses();

  const options: Partial<Option>[] = React.useMemo(
    () =>
      getValue(
        organizationClasses.map((organizationClass) =>
          getOption({ organizationClass })
        ),
        []
      ),
    [organizationClasses]
  );

  const { data: organizationClassData } = useOrganizationClassQuery({
    skip: !value,
    variables: {
      id: getValue(value, ''),
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
      id={name}
      isLoading={loading}
      texts={{
        ...texts,
        clearButtonAriaLabel_one: t('common.combobox.clearOrganizations'),
      }}
      options={options}
      // toggleButtonAriaLabel={t('common.combobox.toggleButtonAriaLabel')}
      // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
      // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
      value={selectedOrganizationClass?.value}
    />
  );
};

export default SingleOrganizationClassSelector;
