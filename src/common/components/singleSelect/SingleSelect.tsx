import classNames from 'classnames';
import { Select, SelectProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import ComboboxLoadingSpinner, {
  ComboboxLoadingSpinnerProps,
} from '../comboboxLoadingSpinner/ComboboxLoadingSpinner';
import styles from './singleSelect.module.scss';

export type SingleSelectProps = ComboboxLoadingSpinnerProps & {
  className?: string;
} & SelectProps;

const SingleSelect: React.FC<SingleSelectProps> = ({
  alignedLabel,
  className,
  isLoading,
  ...rest
}) => {
  const { theme } = useTheme();

  return (
    <ComboboxLoadingSpinner alignedLabel={alignedLabel} isLoading={isLoading}>
      <Select
        {...rest}
        className={classNames(className, styles.select)}
        theme={theme.select}
        children={undefined}
      />
    </ComboboxLoadingSpinner>
  );
};

export default SingleSelect;
