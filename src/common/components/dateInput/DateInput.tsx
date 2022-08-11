import { ClassNames } from '@emotion/react';
import parseDate from 'date-fns/parse';
import {
  DateInput as BaseDateInput,
  DateInputProps as BaseDateInputProps,
} from 'hds-react';
import React from 'react';

import { DATE_FORMAT } from '../../../constants';
import { useTheme } from '../../../domain/app/theme/Theme';
import useLocale from '../../../hooks/useLocale';
import formatDate from '../../../utils/formatDate';
import { isValidDateText } from '../../../utils/validationUtils';

export type DateInputProps = {
  onChange: (date: Date | null) => void;
  value: Date | null;
} & Omit<BaseDateInputProps, 'onChange' | 'value'>;

const formatDateStr = (date: Date | string | null) =>
  date ? formatDate(new Date(date), DATE_FORMAT) : '';

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, onBlur, onChange, value, ...rest }, ref) => {
    const isFocused = React.useRef(false);
    const [inputValue, setInputValue] = React.useState('');
    const { theme } = useTheme();
    const language = useLocale();

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
      const dateStr = value ? formatDate(value, DATE_FORMAT) : '';

      onBlur && onBlur(event);
      setInputValue(dateStr);
    };

    const handleChange = (valueAsString: string) => {
      if (!valueAsString) {
        onChange(null);
      } else if (isValidDateText(valueAsString)) {
        onChange(parseDate(valueAsString, DATE_FORMAT, new Date()));
      }

      setInputValue(valueAsString);
    };

    React.useEffect(() => {
      if (!isFocused.current) {
        const newInputValue = formatDateStr(value);
        setInputValue(newInputValue);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
