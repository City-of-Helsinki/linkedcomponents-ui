import { ClassNames } from '@emotion/react';
import { TimeInput as BaseTimeInput, TimeInputProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, ...rest }, ref) => {
    const { theme } = useTheme();

    return (
      <ClassNames>
        {({ css, cx }) => (
          <BaseTimeInput
            {...rest}
            ref={ref}
            className={cx(className, css(theme.textInput))}
          />
        )}
      </ClassNames>
    );
  }
);

export default TimeInput;
