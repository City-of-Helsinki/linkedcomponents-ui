import classNames from 'classnames';
import { Select as HDSSelect, SelectProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import SelectLoadingSpinner, {
  SelectLoadingSpinnerProps,
} from '../selectLoadingSpinner/SelectLoadingSpinner';
import styles from './singleSelect.module.scss';

export type SingleSelectProps = SelectLoadingSpinnerProps & {
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
    <SelectLoadingSpinner alignedLabel={alignedLabel} isLoading={isLoading}>
      <HDSSelect
        {...rest}
        className={classNames(className, styles.select)}
        theme={theme.select}
        children={undefined}
      />
    </SelectLoadingSpinner>
  );
};

export default SingleSelect;
