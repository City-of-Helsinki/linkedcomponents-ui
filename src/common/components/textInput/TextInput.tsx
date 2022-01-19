import { css } from '@emotion/css';
import classNames from 'classnames';
import { TextInput as BaseTextInput, TextInputProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...rest }, ref) => {
    const { theme } = useTheme();
    return (
      <BaseTextInput
        {...rest}
        ref={ref}
        className={classNames(className, css(theme.textInput))}
      />
    );
  }
);

export default TextInput;
