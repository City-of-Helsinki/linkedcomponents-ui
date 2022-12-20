import { ClassNames } from '@emotion/react';
import { TimeInputProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import CustomTimeInput from './CustomTimeInput';

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, ...rest }, ref) => {
    const { theme } = useTheme();

    return (
      <ClassNames>
        {({ css, cx }) => (
          <CustomTimeInput
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
