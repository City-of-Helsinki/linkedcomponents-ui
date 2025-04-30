import classNames from 'classnames';
import { Select, SingleSelectProps as HdsSingleSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import { OptionType } from '../../../types';
import {
  getA11ySelectionMessage,
  getA11yStatusMessage,
} from '../../../utils/accessibilityUtils';
import ComboboxLoadingSpinner, {
  ComboboxLoadingSpinnerProps,
} from '../comboboxLoadingSpinner/ComboboxLoadingSpinner';
import styles from './singleSelect.module.scss';

export type SingleSelectProps = ComboboxLoadingSpinnerProps &
  HdsSingleSelectProps<OptionType>;

const SingleSelect: React.FC<SingleSelectProps> = ({
  alignedLabel,
  className,
  isLoading,
  ...rest
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <ComboboxLoadingSpinner alignedLabel={alignedLabel} isLoading={isLoading}>
      <Select
        {...rest}
        className={classNames(className, styles.select)}
        getA11yStatusMessage={(options) => getA11yStatusMessage(options, t)}
        getA11ySelectionMessage={
          /* istanbul ignore next */
          (options) => getA11ySelectionMessage(options, t)
        }
        theme={theme.select}
      />
    </ComboboxLoadingSpinner>
  );
};

export default SingleSelect;
