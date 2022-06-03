import classNames from 'classnames';
import React from 'react';

import { OptionType } from '../../../../types';
import { EVENT_LIST_TYPES } from '../../constants';
import styles from './listTypeSelector.module.scss';

export type ListTypeOption = {
  icon: React.ReactNode;
} & OptionType;

interface Props {
  caption: string;
  name: string;
  onChange: (type: EVENT_LIST_TYPES) => void;
  options: ListTypeOption[];
  value: string;
}

const ListTypeSelector: React.FC<Props> = ({
  caption,
  name,
  onChange,
  options,
  value,
}) => {
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    onChange(ev.target.value as EVENT_LIST_TYPES);
  };

  return (
    <fieldset className={styles.listTypeSelector}>
      <legend className={styles.caption}>{caption} </legend>
      {options.map(({ icon, label, value: optionValue }) => {
        const checked = value === optionValue;
        return (
          <div
            key={optionValue}
            className={classNames(styles.option, {
              [styles.isChecked]: checked,
            })}
          >
            <input
              type="radio"
              checked={checked}
              onChange={handleChange}
              name={name}
              id={`list-type-selector-${name}-${optionValue}`}
              value={optionValue}
            />
            <label htmlFor={`list-type-selector-${name}-${optionValue}`}>
              <span className={styles.optionText}>{label}</span>
              {icon}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
};

export default ListTypeSelector;
