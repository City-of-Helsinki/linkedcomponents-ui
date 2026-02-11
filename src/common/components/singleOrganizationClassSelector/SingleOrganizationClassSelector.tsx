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
import getValue from '../../../utils/getValue';
import Select, { SelectPropsWithValue } from '../select/Select';

const getOption = ({
  organizationClass,
}: {
  organizationClass: OrganizationClassFieldsFragment;
}): OptionType => {
  const { id: value, name: label } =
    getOrganizationClassFields(organizationClass);

  return { label, value };
};

type SingleOrganizationClassSelectorProps = SelectPropsWithValue<string | null>;

const SingleOrganizationClassSelector: React.FC<
  SingleOrganizationClassSelectorProps
> = ({ texts, name, value, ...rest }) => {
  const { t } = useTranslation();

  const { loading, organizationClasses } = useAllOrganizationClasses();

  const { data: organizationClassData } = useOrganizationClassQuery({
    skip: !value,
    variables: {
      id: getValue(value, ''),
      createPath: getPathBuilder(organizationClassPathBuilder),
    },
  });

  const options = React.useMemo(
    () =>
      getValue(
        organizationClasses.map((organizationClass) =>
          getOption({ organizationClass })
        ),
        []
      ),
    [organizationClasses]
  );

  const selectedOrganizationClass = React.useMemo(() => {
    const organizationClass = organizationClassData?.organizationClass;
    return organizationClass ? [getOption({ organizationClass })] : [];
  }, [organizationClassData]);

  const memoizedTexts = React.useMemo(
    () => ({
      ...texts,
      clearButtonAriaLabel_one: t('common.combobox.clearOrganizations'),
    }),
    [texts, t]
  );

  return (
    <Select
      {...rest}
      multiSelect={false}
      id={name}
      isLoading={loading}
      texts={memoizedTexts}
      options={options}
      value={selectedOrganizationClass}
    />
  );
};

export default SingleOrganizationClassSelector;
