import { SingleSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useAllDataSources from '../../../domain/dataSource/hooks/useAllDataSources';
import {
  dataSourcePathBuilder,
  getDataSourceFields,
} from '../../../domain/dataSource/utils';
import {
  DataSourceFieldsFragment,
  useDataSourceQuery,
} from '../../../generated/graphql';
import { OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import Combobox from '../combobox/Combobox';

type ValueType = string | null;

const getOption = ({
  dataSource,
}: {
  dataSource: DataSourceFieldsFragment;
}): OptionType => {
  const { id: value, name: label } = getDataSourceFields(dataSource);

  return { label: label || /* istanbul ignore next */ value, value };
};

export type SingleDataSourceSelectorProps = {
  name: string;
  showOnlyUserEditable?: boolean;
  value: ValueType;
} & Omit<SingleSelectProps<OptionType>, 'options' | 'value'>;

const SingleDataSourceSelector: React.FC<SingleDataSourceSelectorProps> = ({
  label,
  name,
  showOnlyUserEditable,
  value,
  ...rest
}) => {
  const { t } = useTranslation();

  const { dataSources } = useAllDataSources(showOnlyUserEditable);

  const options: OptionType[] = React.useMemo(
    () =>
      dataSources.map((dataSource) => getOption({ dataSource })) ??
      /* istanbul ignore next */ [],
    [dataSources]
  );

  const { data: dataSourceData } = useDataSourceQuery({
    skip: !value,
    variables: {
      id: value as string,
      createPath: getPathBuilder(dataSourcePathBuilder),
    },
  });

  const selectedDataSource = React.useMemo(() => {
    const dataSource = dataSourceData?.dataSource;
    return dataSource ? getOption({ dataSource }) : null;
  }, [dataSourceData]);

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
      value={selectedDataSource as OptionType | undefined}
    />
  );
};

export default SingleDataSourceSelector;
