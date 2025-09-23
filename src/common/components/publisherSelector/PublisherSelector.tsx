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
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import Select, { SelectPropsWithValue } from '../select/Select';

export type PublisherSelectorProps = {
  publisher?: string | null;
} & SelectPropsWithValue<string | null>;

const PublisherSelector: React.FC<PublisherSelectorProps> = ({
  clearable = false,
  texts,
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
        ? [
            getOrganizationOption({
              idPath: 'id',
              locale,
              organization: organizationData.organization,
              t,
            }),
          ]
        : [],
    [locale, organizationData?.organization, t]
  );

  const options = useMemo(() => {
    if (publisher) {
      return selectedOrganization.length ? selectedOrganization : [];
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
    <Select
      {...rest}
      multiSelect={false}
      clearable={clearable}
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

export default PublisherSelector;
