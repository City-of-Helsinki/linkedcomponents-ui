import classNames from 'classnames';
import { css } from 'emotion';
import { IconCheck } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import { OptionType } from '../../../types';
import Button from '../button/Button';
import styles from './formLanguageSelector.module.scss';

type Option = {
  isCompleted: boolean;
} & OptionType;

interface Props {
  onChange: (selected: string) => void;
  options: Option[];
  selectedLanguage: string;
}

const FormLanguageSelector: React.FC<Props> = ({
  onChange,
  options,
  selectedLanguage,
}) => {
  const { theme } = useTheme();

  const handleChange = (newLanguage: string) => () => {
    onChange(newLanguage);
  };

  return (
    <div
      className={classNames(
        styles.formLanguageSelector,
        css(theme.formLanguageSelector)
      )}
    >
      {options.map((language) => {
        return (
          <Button
            iconRight={
              language.isCompleted ? (
                <IconCheck className={styles.icon} />
              ) : null
            }
            onClick={handleChange(language.value)}
            fullWidth={true}
            variant={
              language.value === selectedLanguage
                ? 'secondary'
                : 'supplementary'
            }
          >
            {language.label}
          </Button>
        );
      })}
    </div>
  );
};

export default FormLanguageSelector;
