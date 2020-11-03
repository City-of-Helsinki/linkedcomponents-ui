import classNames from 'classnames';
import { useCombobox, UseComboboxState } from 'downshift';
import { TextInputProps } from 'hds-react/components/TextInput';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  getA11ySelectionMessage,
  getA11yStatusMessage,
} from '../../../utils/accessibilityUtils';
import InputWrapper from '../inputWrapper/InputWrapper';
import inputStyles from '../inputWrapper/inputWrapper.module.scss';
import { DEFAULT_TIME_INTERVAL } from './constants';
import styles from './timepicker.module.scss';
import { getTimes } from './utils';

export type Props = {
  onBlur: (value?: string) => void;
  onChange: (value: string) => void;
  minuteInterval?: number;
} & Omit<TextInputProps, 'onBlur' | 'onChange'>;

const Timepicker: React.FC<Props> = ({
  className,
  id,
  minuteInterval = DEFAULT_TIME_INTERVAL,
  onBlur,
  onChange,
  value,
  ...rest
}) => {
  const [timesList] = React.useState(() => getTimes(minuteInterval));
  const [inputItems, setInputItems] = React.useState(timesList);
  // used to prevent onBlur being called when user is clicking menu item with mouse
  const menuItemClicked = React.useRef<boolean>(false);
  const { t } = useTranslation();

  const handleInputValueChange = ({
    inputValue,
  }: Partial<UseComboboxState<string>>) => {
    if (inputValue) {
      const modifiedInputValue = inputValue.replace('.', ':').toLowerCase();
      setInputItems(
        timesList.filter((time) => time.startsWith(modifiedInputValue))
      );
    } else {
      setInputItems(timesList);
    }
    onChange(inputValue || '');
  };

  const {
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
    openMenu();
  };

  const handleInputOnBlur = () => {
    if (!menuItemClicked.current) {
      onBlur(selectedItem || value);
    }
    menuItemClicked.current = false;
  };

  const { id: inputId, ...inputProps } = getInputProps({
    className: classNames(inputStyles.input),
    onFocus: handleInputOnFocus,
    onBlur: handleInputOnBlur,
    value: value,
  });
  const { htmlFor, ...labelProps } = getLabelProps();
  const showDropdown = isOpen && inputItems.length > 0;

  return (
    <InputWrapper
      className={classNames(styles.wrapper, className)}
      {...rest}
      {...labelProps}
      id={htmlFor}
      labelId={labelProps.id}
    >
      <div {...getComboboxProps()}>
        <input id={inputId} {...inputProps} />
      </div>
      <ul
        {...getMenuProps({
          className: classNames(styles.dropdownMenu, {
            [styles.isOpen]: showDropdown,
          }),
        })}
      >
        {showDropdown &&
          inputItems.map((item, index) => (
            <li
              {...getItemProps({
                key: `${item}${index}`,
                item,
                index,
                className: classNames(styles.dropdownMenuItem, {
                  [styles.isHighlighted]: highlightedIndex === index,
                }),
                // prevent onBlur being called when clicking menu item
                onMouseDown: () => {
                  menuItemClicked.current = true;
                  setTimeout(() => (menuItemClicked.current = false));
                },
              })}
            >
              {item}
            </li>
          ))}
      </ul>
    </InputWrapper>
  );
};

export default Timepicker;
