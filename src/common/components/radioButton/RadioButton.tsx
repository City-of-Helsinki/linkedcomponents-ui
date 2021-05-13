import { css } from '@emotion/css';
import classNames from 'classnames';
import { RadioButton as BaseRadioButton, RadioButtonProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './radioButton.module.scss';

const RadioButton: React.FC<RadioButtonProps> = ({ className, ...rest }) => {
  const { theme } = useTheme();
  return (
    <BaseRadioButton
      {...rest}
      className={classNames(
        className,
        styles.radioButton,
        css(theme.radioButton)
      )}
    />
  );
};

export default RadioButton;
