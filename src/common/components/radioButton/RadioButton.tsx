import classNames from 'classnames';
import { css } from 'emotion';
import { RadioButton as BaseRadioButton, RadioButtonProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const RadioButton: React.FC<RadioButtonProps> = ({ className, ...rest }) => {
  const { theme } = useTheme();
  return (
    <BaseRadioButton
      {...rest}
      className={classNames(className, css(theme.radioButton))}
    />
  );
};

export default RadioButton;
