import classNames from 'classnames';
import { useCombobox, UseComboboxState } from 'downshift';
import { css } from 'emotion';
import { IconClock, TextInputProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import {
  getA11ySelectionMessage,
  getA11yStatusMessage,
} from '../../../utils/accessibilityUtils';
import InputWrapper from '../inputWrapper/InputWrapper';
import inputStyles from '../inputWrapper/inputWrapper.module.scss';
import ScrollIntoViewWithFocus from '../scrollIntoViewWithFocus/ScrollIntoViewWithFocus';
import { DEFAULT_TIME_INTERVAL } from './constants';
import styles from './timepicker.module.scss';
import { getTimes } from './utils';

export type Props = {
  onBlur: (value: string) => void;
  onChange: (value: string) => void;
  minuteInterval?: number;
  value: string;
} & Omit<TextInputProps, 'onBlur' | 'onChange' | 'value'>;

const Timepicker: React.FC<Props> = ({
  className,
  id,
  minuteInterval = DEFAULT_TIME_INTERVAL,
  onBlur,
  onChange,
  placeholder,
  value,
  ...rest
}) => {
  const { theme } = useTheme();
  const [timesList] = React.useState(() => getTimes(minuteInterval));
  const [inputItems, setInputItems] = React.useState(timesList);
  // used to prevent onBlur being called when user is clicking menu item with mouse
  const menuItemMouseDown = React.useRef<boolean>(false);
  const menuItemMouseUp = React.useRef<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { t } = useTranslation();

  const handleInputValueChange = ({
    inputValue,
  }: Partial<UseComboboxState<string>>) => {
    if (inputValue) {
      const modifiedInputValue = inputValue.replace(':', '.').toLowerCase();
      setInputItems(
        timesList.filter((time) => time.startsWith(modifiedInputValue))
      );
    } else {
      setInputItems(timesList);
    }

    onChange(inputValue || '');
  };

  const {
    closeMenu,
    isOpen,
    selectedItem,
    openMenu,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    id,
    items: inputItems,
    onInputValueChange: handleInputValueChange,
    getA11yStatusMessage: (options) => getA11yStatusMessage(options, t),
    getA11ySelectionMessage: (options) => getA11ySelectionMessage(options, t),
  });

  const handleInputOnFocus = () => {
    if (!menuItemMouseUp.current) {
      openMenu();
    }
    menuItemMouseUp.current = false;
  };

  const handleInputOnBlur = () => {
    if (!menuItemMouseDown.current) {
      const modifiedInputValue = value.replace(':', '.').toLowerCase();

      if (modifiedInputValue !== value) {
        onChange(modifiedInputValue);
      }

      onBlur(selectedItem || modifiedInputValue);
    }
    menuItemMouseDown.current = false;
  };

  const toggleCalendar = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
      inputRef.current?.focus();
    }
  };

  const { id: inputId, ...inputProps } = getInputProps({
    className: classNames(inputStyles.input, styles.timepickerInput),
    onFocus: handleInputOnFocus,
    onBlur: handleInputOnBlur,
    ref: inputRef,
    value: value,
  });
  const { htmlFor, ...labelProps } = getLabelProps();
  const showDropdown = isOpen && inputItems.length > 0;

  return (
    <InputWrapper
      className={classNames(styles.wrapper, className, css(theme.timepicker))}
      {...rest}
      {...labelProps}
      hasIcon={true}
      id={htmlFor}
      labelId={labelProps.id}
    >
      <div {...getComboboxProps()} className={styles.inputWrapper}>
        <input {...inputProps} id={inputId} placeholder={placeholder} />
        <button
          type="button"
          aria-label={t('common.timepicker.accessibility.buttonTimeList')}
          className={styles.calendarButton}
          onClick={toggleCalendar}
        >
          <IconClock />
        </button>
      </div>
      <ul
        {...getMenuProps({
          className: classNames(styles.dropdownMenu, {
            [styles.isOpen]: showDropdown,
          }),
        })}
      >
        {showDropdown &&
          inputItems.map((item, index) => {
            const isHighlighted = highlightedIndex === index;
            const { ref, ...itemProps } = getItemProps({
              as: 'li',
              key: `${item}${index}`,
              item,
              index,
              className: classNames(styles.dropdownMenuItem, {
                [styles.isHighlighted]: isHighlighted,
              }),
              // prevent onBlur being called when clicking menu item
              onMouseDown: () => {
                menuItemMouseDown.current = true;
              },
              // prevent input to be focused when clicking menu item
              onMouseUp: () => {
                menuItemMouseUp.current = true;
              },
            });

            return (
              <ScrollIntoViewWithFocus isFocused={isHighlighted} {...itemProps}>
                {item}
              </ScrollIntoViewWithFocus>
            );
          })}
      </ul>
    </InputWrapper>
  );
};

export default Timepicker;
