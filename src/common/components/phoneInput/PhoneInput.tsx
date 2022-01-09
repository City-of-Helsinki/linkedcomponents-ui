import { css } from '@emotion/css';
import classNames from 'classnames';
import { PhoneInput as BasePhoneInput, PhoneInputProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const PhoneInput: React.FC<PhoneInputProps> = ({ className, ...rest }) => {
  const { theme } = useTheme();

  return (
    <BasePhoneInput
      {...rest}
      className={classNames(className, css(theme.textInput))}
    />
  );
};

export default PhoneInput;
