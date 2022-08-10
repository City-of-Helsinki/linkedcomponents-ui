import { ClassNames } from '@emotion/react';
import {
  DateInput as BaseDateInput,
  DateInputProps as BaseDateInputProps,
} from 'hds-react';
import React from 'react';

import { DATE_FORMAT } from '../../../constants';
import { useTheme } from '../../../domain/app/theme/Theme';
import useLocale from '../../../hooks/useLocale';
import formatDate from '../../../utils/formatDate';
import parseDateText from '../../../utils/parseDateText';
import { isValidDate } from '../../../utils/validationUtils';

export type DateInputProps = {
  onChange: (date: Date | null) => void;
  value: Date | null;
} & Omit<BaseDateInputProps, 'onChange' | 'value'>;

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, onBlur, onChange, value, ...rest }, ref) => {
    const isFocused = React.useRef(false);
    const [inputValue, setInputValue] = React.useState('');
    const { theme } = useTheme();
    const language = useLocale();

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
      const dateStr = value ? formatDate(value, DATE_FORMAT) : '';

      setInputValue(dateStr);
      onBlur && onBlur(event);
    };

    const handleChange = (valueAsString: string) => {
      if (!valueAsString) {
        onChange(null);
      } else if (isValidDate(valueAsString)) {
        onChange(parseDateText(valueAsString));
      }

      setInputValue(valueAsString);
    };

    React.useEffect(() => {
      if (!isFocused.current) {
        setInputValue(value ? formatDate(value, DATE_FORMAT) : '');
      }
    }, [value]);

    return (
      <ClassNames>
        {({ css, cx }) => (
          <div
            onBlur={() => (isFocused.current = false)}
            onFocus={() => (isFocused.current = true)}
          >
            <BaseDateInput
              {...rest}
              onBlur={handleBlur}
              onChange={handleChange}
              value={inputValue}
              ref={ref}
              className={cx(
                className,
                css(theme.dateInput),
                css(theme.textInput)
              )}
              language={language}
            />
          </div>
        )}
      </ClassNames>
    );
  }
);

export default DateInput;
