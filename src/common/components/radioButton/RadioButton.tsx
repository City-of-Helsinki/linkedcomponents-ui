import { ClassNames } from '@emotion/react';
import { RadioButton as BaseRadioButton, RadioButtonProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './radioButton.module.scss';

const RadioButton: React.FC<RadioButtonProps> = ({ className, ...rest }) => {
  const { theme } = useTheme();
  return (
    <ClassNames>
      {({ css, cx }) => (
        <BaseRadioButton
          {...rest}
          className={cx(styles.radioButton, className, css(theme.radioButton))}
        />
      )}
    </ClassNames>
  );
};

export default RadioButton;
