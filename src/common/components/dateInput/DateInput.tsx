import { ClassNames } from '@emotion/react';
import { DateInput as BaseDateInput, DateInputProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import useLocale from '../../../hooks/useLocale';

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...rest }, ref) => {
    const { theme } = useTheme();
    const language = useLocale();

    return (
      <ClassNames>
        {({ css, cx }) => (
          <BaseDateInput
            {...rest}
            ref={ref}
            className={cx(
              className,
              css(theme.dateInput),
              css(theme.textInput)
            )}
            language={language}
          />
        )}
      </ClassNames>
    );
  }
);

export default DateInput;
