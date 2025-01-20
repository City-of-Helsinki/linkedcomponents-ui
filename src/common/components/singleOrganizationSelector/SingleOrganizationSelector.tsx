import { TFunction } from 'i18next';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useAllOrganizations from '../../../domain/organization/hooks/useAllOrganizations';
import { getOrganizationFields } from '../../../domain/organization/utils';
import { OrganizationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getValue from '../../../utils/getValue';
import Select, { SelectPropsWithValue } from '../select/Select';

const getOption = ({
  locale,
  organization,
  t,
}: {
  locale: Language;
  organization: OrganizationFieldsFragment;
  t: TFunction;
}): OptionType => {
  const { atId: value, fullName: label } = getOrganizationFields(
    organization,
    locale,
    t
  );

  return { label, value };
};

type SingleOrganizationSelectorProps = SelectPropsWithValue<string | null>;

const SingleOrganizationSelector: React.FC<SingleOrganizationSelectorProps> = ({
  texts,
  name,
  value,
  ...rest
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const { loading, organizations } = useAllOrganizations();

  const options = React.useMemo(
    () =>
      sortBy(
        getValue(
          organizations.map((organization) =>
            getOption({ locale, organization, t })
          ),
          []
        ),
        'label'
      ),
    [locale, organizations, t]
  );

  const selectedOrganization = React.useMemo(() => {
    const option = getValue(
      options.find((o) => o.value === value),
      null
    );

    return option ? [option] : [];
  }, [options, value]);

  return (
    <Select
      {...rest}
      multiSelect={false}
      id={name}
      isLoading={loading}
      texts={{
        ...texts,
        clearButtonAriaLabel_one: t('common.combobox.clearOrganizations'),
      }}
      options={options}
      value={selectedOrganization}
    />
  );
};

export default SingleOrganizationSelector;
