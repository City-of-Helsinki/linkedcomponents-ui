import classNames from 'classnames';
import { css } from 'emotion';
import {
  TextInput as BaseTextInput,
  TextInputProps,
} from 'hds-react/components/TextInput';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const TextInput: React.FC<TextInputProps> = ({ className, ...rest }) => {
  const { theme } = useTheme();

  return (
    <BaseTextInput
      {...rest}
      className={classNames(className, css(theme.textInput))}
    />
  );
};

export default TextInput;
