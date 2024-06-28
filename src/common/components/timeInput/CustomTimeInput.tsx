/* eslint-disable max-len */
import 'hds-core';

import classNames from 'classnames';
import { TimeInputProps } from 'hds-react';
import React, {
  FC,
  FocusEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';

import composeAriaDescribedBy from '../../../utils/composeAriaDescribedBy';
import InputWrapper from '../inputWrapper/InputWrapper';
import textInputStyles from '../inputWrapper/inputWrapper.module.scss';
import styles from './customTimeInput.module.scss';

const NUMBER_KEYS: string[] = '0,1,2,3,4,5,6,7,8,9'.split(',');

/**
 * Pad a one-char string with a leading zero
 */
const zeroPad = (value: string) => {
  if (value.length === 1) {
    return `0${value}`;
  }
  return value;
};

/**
 * Increment a number inside a range
 * @param min Min number to return
 * @param max Max number to return
 * @param current Number to modify
 * @param modifier Modifier number to add tot the current number
 */
const incrementNumber = (
  min: number,
  max: number,
  current: number,
  modifier: number
) => {
  return Math.max(Math.min(current + modifier, max), min);
};

/**
 * Returns hour and minute values from a provided value string. The provided value can be either value or defaultValue property.
 */
const getHourAndMinuteValues = (value?: string): string[] | null => {
  const valueString = `${value}`;
  if (value && valueString.length > 0) {
    if (valueString.match(/^\d{2}:\d{2}$/)) {
      return valueString.split(':');
    }
  }
  return null;
};

const getHours = (hoursAndMinutes: string[] | null): string =>
  hoursAndMinutes ? hoursAndMinutes[0] : '';

const getMinutes = (hoursAndMinutes: string[] | null): string =>
  hoursAndMinutes ? hoursAndMinutes[1] : '';

const getTime = (hoursAndMinutes: string[] | null): string =>
  hoursAndMinutes ? hoursAndMinutes.join(':') : '';

const getNewTimeValue = (newHours: string, newMinutes: string) => {
  return newHours.length === 0 && newMinutes.length === 0
    ? ''
    : `${newHours}:${newMinutes}`;
};

const getNewHoursOrMinutesValue = ({
  event,
  type,
  value,
}: {
  event: React.KeyboardEvent<HTMLInputElement>;
  type: 'hours' | 'minutes';
  value: string;
}) => {
  const modifier = event.key === 'ArrowUp' ? 1 : -1;
  /* istanbul ignore next */
  const minutesAsInt = parseInt(value, 10) || 0;
  const maxValue = type === 'hours' ? 23 : 59;

  return zeroPad(`${incrementNumber(0, maxValue, minutesAsInt, modifier)}`);
};

const shouldFocusToMinutesAfterHoursKeyUp = (
  event: React.KeyboardEvent<HTMLInputElement>
) =>
  event.currentTarget.value.length === 2 &&
  event.currentTarget.value !== '00' &&
  NUMBER_KEYS.includes(event.key);

const isArrowLeftKey = (event: React.KeyboardEvent<HTMLInputElement>) =>
  event.key === 'ArrowLeft' && !event.shiftKey;

const isArrowRightKey = (event: React.KeyboardEvent<HTMLInputElement>) =>
  event.key === 'ArrowRight' && !event.shiftKey;

const isArrowUpOrDownKey = (event: React.KeyboardEvent<HTMLInputElement>) =>
  ['ArrowUp', 'ArrowDown'].includes(event.key) && !event.shiftKey;

const isShortNumericString = (inputValue: string): boolean =>
  inputValue.match(/^(\d{1,2})?$/) !== null;

const CustomTimeInput: FC<TimeInputProps> = ({
  className,
  disabled = false,
  defaultValue,
  value,
  errorText,
  helperText,
  hideLabel,
  invalid,
  id,
  label,
  hoursLabel,
  minutesLabel,
  onChange = () => null,
  required,
  style,
  successText,
  infoText,
  tooltipLabel,
  tooltipText,
  tooltipButtonLabel,
  type = 'text',
  ...rest
}) => {
  if (defaultValue !== undefined && value !== undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      'Use either defaultValue (for uncontrolled components) or value (for controlled components) in HDS TimeInput component.'
    );
  }

  const [isControlledComponent] = useState(value !== undefined);

  const hoursAndMinutes: string[] | null = getHourAndMinuteValues(
    defaultValue || value
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const hoursInputRef = useRef<HTMLInputElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);
  const [hours, setHours] = useState<string>(getHours(hoursAndMinutes));
  const [minutes, setMinutes] = useState<string>(getMinutes(hoursAndMinutes));
  const [time, setTime] = useState<string>(getTime(hoursAndMinutes));

  const wrapperProps = {
    className,
    errorText,
    helperText,
    hideLabel,
    id,
    invalid,
    label,
    required,
    style,
    successText,
    infoText,
    tooltipLabel,
    tooltipText,
    tooltipButtonLabel,
  };

  /**
   * Update the full time input and dispatch the native onChange event
   */
  const updateTimeInput = (newHours: string, newMinutes: string) => {
    const newTimeValue = getNewTimeValue(newHours, newMinutes);

    setHours(newHours);
    setMinutes(newMinutes);
    setTime(newTimeValue);

    const nativeInputValueSetter = (
      Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ) as PropertyDescriptor
    ).set;
    nativeInputValueSetter?.call(inputRef.current, newTimeValue);
    const event = new Event('input', { bubbles: true });
    inputRef.current?.dispatchEvent(event);
  };

  /**
   * Select input text on focus
   */
  const onInputFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    event.target.select();
  };

  /**
   * Handle hours input change
   */
  const onHoursChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const hoursValue = event.target.value.slice(-2);

    // Allow number string only
    if (!isShortNumericString(hoursValue)) {
      event.preventDefault();
      return false;
    }

    updateTimeInput(hoursValue, minutes);
    return true;
  };

  /**
   * Handle minutes input change
   */
  const onMinutesChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const minutesValue = event.target.value.slice(-2);

    // Allow numbers string only
    if (!isShortNumericString(minutesValue)) {
      event.preventDefault();
      return false;
    }

    updateTimeInput(hours, minutesValue);
    return true;
  };

  /**
   * Focus minutes input after hours input has 2 chars
   */
  const onHoursKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (shouldFocusToMinutesAfterHoursKeyUp(event)) {
      minutesInputRef.current?.focus();
    }
  };

  /**
   * Handle keydown event on hours input
   */
  const onHoursKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    // Move to the minutes input with right arrow key
    if (isArrowRightKey(event)) {
      event.preventDefault();
      minutesInputRef.current?.focus();
    }
    // Increase/decrease the value with arrow up/down keys
    if (isArrowUpOrDownKey(event)) {
      event.preventDefault();
      const newHours = getNewHoursOrMinutesValue({
        event,
        type: 'hours',
        value: hours,
      });
      updateTimeInput(newHours, minutes);
    }
  };

  /**
   * Handle keydown event on minutes input
   */
  const onMinutesKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    // Move to the hours input with left arrow key
    if (isArrowLeftKey(event)) {
      event.preventDefault();
      hoursInputRef.current?.focus();
    }
    // Increase/decrease the value with arrow up/down keys
    if (isArrowUpOrDownKey(event)) {
      event.preventDefault();
      const newMinutes = getNewHoursOrMinutesValue({
        event,
        type: 'minutes',
        value: minutes,
      });
      updateTimeInput(hours, newMinutes);
    }
  };

  /**
   * Format hours on blur
   */
  const onHoursBlur: React.FocusEventHandler = () => {
    if (hours.length > 0) {
      updateTimeInput(zeroPad(hours), minutes);
    }
  };

  /**
   * Format minutes on blur
   */
  const onMinutesBlur: React.FocusEventHandler = () => {
    /* istanbul ignore else */
    if (minutes.length > 0) {
      updateTimeInput(hours, zeroPad(minutes));
    }
  };

  // Compose aria-describedby attribute
  const ariaDescribedBy =
    composeAriaDescribedBy(id, helperText, errorText, successText, infoText) ||
    undefined;

  // Compose props for the input frame
  const frameProps = {
    className: classNames(
      textInputStyles.input,
      styles.timeInputFrame,
      disabled && styles.disabled
    ),
    onClick: (event: React.MouseEvent) => {
      if (
        event.target !== hoursInputRef.current &&
        event.target !== minutesInputRef.current
      ) {
        hoursInputRef.current?.focus();
      }
    },
  };

  const hourInputId = `${id}-hours`;
  const minuteInputId = `${id}-minutes`;
  const labelId = `${id}-label`;

  useEffect(() => {
    if (isControlledComponent && value !== time) {
      const newHoursAndMinutes = getHourAndMinuteValues(value);

      setHours(getHours(newHoursAndMinutes));
      setMinutes(getMinutes(newHoursAndMinutes));
      setTime(getTime(newHoursAndMinutes));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isControlledComponent, value]);

  return (
    <InputWrapper {...wrapperProps} id={id} labelId={labelId} isAriaLabelledBy>
      <div {...frameProps} role="group" aria-labelledby={labelId}>
        <input
          aria-hidden
          readOnly
          className={styles.fullInput}
          disabled={disabled}
          id={id}
          onChange={onChange}
          ref={inputRef}
          required={required}
          type={type}
          tabIndex={-1}
          value={time}
          {...rest}
        />
        <label htmlFor={hourInputId} className={styles.partialInputLabel}>
          {hoursLabel}
        </label>
        <input
          className={styles.partialInput}
          type="text"
          disabled={disabled}
          id={hourInputId}
          ref={hoursInputRef}
          value={hours}
          inputMode="numeric"
          onChange={onHoursChange}
          onKeyDown={onHoursKeyDown}
          onKeyUp={onHoursKeyUp}
          onFocus={onInputFocus}
          onBlur={onHoursBlur}
          aria-describedby={ariaDescribedBy}
          placeholder="--"
        />
        <div className={styles.divider}>:</div>
        <label htmlFor={minuteInputId} className={styles.partialInputLabel}>
          {minutesLabel}
        </label>
        <input
          className={styles.partialInput}
          type="text"
          disabled={disabled}
          id={minuteInputId}
          ref={minutesInputRef}
          value={minutes}
          inputMode="numeric"
          onChange={onMinutesChange}
          onKeyDown={onMinutesKeyDown}
          onFocus={onInputFocus}
          onBlur={onMinutesBlur}
          aria-describedby={ariaDescribedBy}
          placeholder="--"
        />
      </div>
    </InputWrapper>
  );
};

export default CustomTimeInput;
