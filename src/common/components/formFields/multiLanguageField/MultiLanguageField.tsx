import { Field } from 'formik';
import { TextInputProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ORDERED_LE_DATA_LANGUAGES } from '../../../../constants';
import lowerCaseFirstLetter from '../../../../utils/lowerCaseFirstLetter';
import upperCaseFirstLetter from '../../../../utils/upperCaseFirstLetter';
import TextInputField from '../textInputField/TextInputField';
import styles from './multiLanguageField.module.scss';

type Props = {
  labelKey?: string;
  languages: string[];
  name: string;
  placeholderKey?: string;
} & Omit<TextInputProps, 'id'>;

const MultiLanguageField: React.FC<Props> = ({
  helperText,
  label,
  labelKey,
  languages,
  name,
  placeholder,
  placeholderKey,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.multiLanguageField}>
      {ORDERED_LE_DATA_LANGUAGES.filter((l) => languages.includes(l)).map(
        (language) => {
          const langText = lowerCaseFirstLetter(
            t(`form.inLanguage.${language}`)
          );

          return (
            <div key={language}>
              <Field
                {...rest}
                component={TextInputField}
                name={`${name}.${language}`}
                helper={helperText}
                label={
                  label ||
                  (labelKey && upperCaseFirstLetter(t(labelKey, { langText })))
                }
                placeholder={
                  placeholder ||
                  (placeholderKey && t(placeholderKey, { langText }))
                }
              />
            </div>
          );
        }
      )}
    </div>
  );
};

export default MultiLanguageField;
