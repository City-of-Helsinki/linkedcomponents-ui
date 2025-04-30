import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getOrganizationOption,
  organizationPathBuilder,
} from '../../../domain/organization/utils';
import useUser from '../../../domain/user/hooks/useUser';
import useUserOrganizations from '../../../domain/user/hooks/useUserOrganizations';
import { useOrganizationQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import Combobox, { SingleComboboxProps } from '../combobox/Combobox';

export type PublisherSelectorProps = {
  publisher?: string | null;
} & Omit<SingleComboboxProps<string | null>, 'toggleButtonAriaLabel'>;

const PublisherSelector: React.FC<PublisherSelectorProps> = ({
  clearable = false,
  label,
  name,
  publisher,
  value,
  ...rest
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { user } = useUser();
  const { loading, organizations } = useUserOrganizations(user);

  const { data: organizationData } = useOrganizationQuery({
    skip: !value,
    variables: {
      id: getValue(value, ''),
      createPath: getPathBuilder(organizationPathBuilder),
      dissolved: false,
    },
  });

  const selectedOrganization = React.useMemo(
    () =>
      organizationData?.organization
        ? getOrganizationOption({
            idPath: 'id',
            locale,
            organization: organizationData.organization,
            t,
          })
        : null,
    [locale, organizationData?.organization, t]
  );

  const options = useMemo(() => {
    if (publisher) {
      return selectedOrganization ? [selectedOrganization] : [];
    }
    return organizations.map((org) =>
      getOrganizationOption({
        idPath: 'id',
        locale,
        organization: org,
        t,
      })
    );
  }, [locale, organizations, publisher, selectedOrganization, t]);

  return (
    <Combobox
      {...rest}
      multiselect={false}
      clearable={clearable}
      id={name}
      isLoading={loading}
      label={label}
      options={options}
      clearButtonAriaLabel={t('common.combobox.clearOrganizations')}
      toggleButtonAriaLabel={t('common.combobox.toggleButtonAriaLabel')}
      // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
      // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
      value={selectedOrganization as OptionType | undefined}
    />
  );
};

export default PublisherSelector;
