import classNames from 'classnames';
import { Select, SingleSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import { OptionType } from '../../../types';
import {
  getA11ySelectionMessage,
  getA11yStatusMessage,
} from '../../../utils/accessibilityUtils';
import styles from '../select/select.module.scss';

const SingleSelect: React.FC<SingleSelectProps<OptionType>> = ({
  className,
  ...rest
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
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
  );
};

export default SingleSelect;
