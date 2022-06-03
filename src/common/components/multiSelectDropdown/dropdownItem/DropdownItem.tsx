import classNames from 'classnames';
import React from 'react';

import { OptionType } from '../../../../types';
import Checkbox from '../../checkbox/Checkbox';
import ScrollIntoViewWithFocus from '../../scrollIntoViewWithFocus/ScrollIntoViewWithFocus';
import styles from './dropdownItem.module.scss';

interface DropdownItemProps {
  index: number;
  isChecked: boolean;
  isFocused: boolean;
  name: string;
  onItemChange: (val: OptionType) => void;
  option: OptionType;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  index,
  isChecked,
  isFocused,
  name,
  onItemChange,
  option,
}) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const id = `${name}-option-${index}`;

  React.useEffect(() => {
    if (isFocused) {
      ref.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const handleItemChange = () => {
    onItemChange(option);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    /* istanbul ignore else */
    if (event.key === 'Enter') {
      handleItemChange();
    }
  };

  return (
    <ScrollIntoViewWithFocus
      className={classNames(styles.dropdownItem, {
        [styles.isFirst]: index === 0,
      })}
      key={option.value}
      isFocused={isFocused}
    >
      <Checkbox
        ref={ref}
        checked={isChecked}
        id={id}
        label={option.label}
        name={name}
        onChange={handleItemChange}
        onKeyDown={handleKeyDown}
        value={option.value}
      />
    </ScrollIntoViewWithFocus>
  );
};

export default DropdownItem;
