import React from 'react';
import { useTranslation } from 'react-i18next';

import useOrganizationOptions from '../../../../domain/organization/hooks/useOrganizationOptions';
import getValue from '../../../../utils/getValue';
import FilterTag, { FilterTagProps } from '../FilterTag';

type Props = Omit<FilterTagProps, 'text' | 'type'>;

const PublisherFilterTag: React.FC<Props> = ({ value, ...rest }) => {
  const { t } = useTranslation();
  const { loading, options } = useOrganizationOptions();

  const name = getValue(options.find((o) => o.value === value)?.label, '');

  return (
    <FilterTag
      {...rest}
      text={loading ? t('common.loading') : name}
      type="publisher"
      value={value}
    />
  );
};

export default PublisherFilterTag;
