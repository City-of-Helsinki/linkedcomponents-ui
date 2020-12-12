import classNames from 'classnames';
import { css } from 'emotion';
import { useFormikContext } from 'formik';
import { IconCheck } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import { OptionType } from '../../../types';
import styles from './formLanguageSelector.module.scss';

interface ItemProps {
  isCompleted: boolean;
  isSelected: boolean;
  language: OptionType;
  onClick: (value: string) => void;
}

const Item: React.FC<ItemProps> = ({
  isCompleted,
  isSelected,
  language,
  onClick,
}) => {
  const handleClick = () => {
    onClick(language.value);
  };

  return (
    <button
      className={classNames(styles.item, { [styles.isSelected]: isSelected })}
      key={language.value}
      onClick={handleClick}
      aria-current={isSelected ? 'step' : 'false'}
      role="link"
      type="button"
    >
      {isCompleted ? <IconCheck className={styles.icon} /> : null}
      {language.label}
    </button>
  );
};

interface Props {
  fields: string[];
  onChange: (selected: string) => void;
  options: OptionType[];
  selectedLanguage: string;
}

const FormLanguageSelector: React.FC<Props> = ({
  fields,
  onChange,
  options,
  selectedLanguage,
}) => {
  const { theme } = useTheme();
  const { getFieldMeta } = useFormikContext();

  const handleChange = (newLanguage: string) => {
    onChange(newLanguage);
  };

  return (
    <div
      className={classNames(
        styles.formLanguageSelector,
        css(theme.formLanguageSelector)
      )}
      role="navigation"
    >
      {options.map((language) => {
        const errors = fields
          .map((field) => getFieldMeta(`${field}.${language.value}`).error)
          .filter((e) => e);
        const isCompleted = !errors.length;
        const isSelected = language.value === selectedLanguage;

        return (
          <Item
            key={language.value}
            isCompleted={isCompleted}
            isSelected={isSelected}
            language={language}
            onClick={handleChange}
          />
        );
      })}
    </div>
  );
};

export default FormLanguageSelector;
