import classNames from 'classnames';
import { css } from 'emotion';
import { useFormikContext } from 'formik';
import { IconCheck } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import { OptionType } from '../../../types';
import Button from '../button/Button';
import styles from './formLanguageSelector.module.scss';

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
        const errors = fields
          .map((field) => getFieldMeta(`${field}.${language.value}`).error)
          .filter((e) => e);
        const isCompleted = !errors.length;

        return (
          <Button
            key={language.value}
            iconRight={
              isCompleted ? <IconCheck className={styles.icon} /> : null
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
