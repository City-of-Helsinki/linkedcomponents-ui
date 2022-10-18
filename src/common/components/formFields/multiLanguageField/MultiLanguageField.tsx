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
  helperKey?: string;
  labelKey?: string;
  languages: string[];
  name: string;
  placeholderKey?: string;
} & Omit<TextInputProps, 'id'>;

const MultiLanguageField: React.FC<Props> = ({
  helperText,
  helperKey,
  label,
  labelKey,
  languages,
  name,
  placeholder,
  placeholderKey,
  ...rest
}) => {
  const { t } = useTranslation();
  if (!languages.length) return null;

  return (
    <div className={styles.multiLanguageField}>
      {ORDERED_LE_DATA_LANGUAGES.map((language) => {
        const langText = lowerCaseFirstLetter(t(`form.inLanguage.${language}`));

        return (
          languages.includes(language) && (
            <div key={language}>
              <Field
                {...rest}
                component={TextInputField}
                name={`${name}.${language}`}
                helper={helperText || (helperKey && t(helperKey, { langText }))}
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
          )
        );
      })}
    </div>
  );
};

export default MultiLanguageField;
