import { ClassNames } from '@emotion/react';
import { TextInput as BaseTextInput, TextInputProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...rest }, ref) => {
    const { theme } = useTheme();
    return (
      <ClassNames>
        {({ css, cx }) => (
          <BaseTextInput
            {...rest}
            ref={ref}
            className={cx(className, css(theme.textInput))}
          />
        )}
      </ClassNames>
    );
  }
);

export default TextInput;
