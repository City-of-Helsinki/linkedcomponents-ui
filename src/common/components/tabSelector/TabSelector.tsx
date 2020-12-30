import classNames from 'classnames';
import { css } from 'emotion';
import { IconCheck } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import { OptionType } from '../../../types';
import styles from './tabSelector.module.scss';

interface ItemProps {
  isCompleted?: boolean;
  isSelected: boolean;
  option: OptionType;
  onClick: (value: string) => void;
}

const Item: React.FC<ItemProps> = ({
  isCompleted = false,
  isSelected,
  option,
  onClick,
}) => {
  const handleClick = () => {
    onClick(option.value);
  };

  return (
    <button
      className={classNames(styles.item, { [styles.isSelected]: isSelected })}
      key={option.value}
      onClick={handleClick}
      aria-current={isSelected ? 'step' : 'false'}
      role="link"
      type="button"
    >
      {isCompleted ? <IconCheck className={styles.icon} /> : null}
      {option.label}
    </button>
  );
};

interface Props {
  onChange: (selected: string) => void;
  options: OptionType[];
  selectedLanguage: string;
}

const TabSelector: React.FC<Props> = ({
  onChange,
  options,
  selectedLanguage,
}) => {
  const { theme } = useTheme();

  const handleChange = (newLanguage: string) => {
    onChange(newLanguage);
  };

  return (
    <div
      className={classNames(styles.tabSelector, css(theme.tabSelector))}
      role="navigation"
    >
      {options.map((option) => {
        const isSelected = option.value === selectedLanguage;

        return (
          <Item
            key={option.value}
            isSelected={isSelected}
            option={option}
            onClick={handleChange}
          />
        );
      })}
    </div>
  );
};

export default TabSelector;
export { Item };
