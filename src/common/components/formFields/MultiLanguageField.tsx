import { Field } from 'formik';
import { TextInputProps } from 'hds-react/components/TextInput';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ORDERED_EVENT_INFO_LANGUAGES } from '../../../domain/event/constants';
import styles from './multiLanguageField.module.scss';
import TextInputField from './TextInputField';

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
  labelText,
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
      {ORDERED_EVENT_INFO_LANGUAGES.map((language) => {
        return (
          languages.includes(language) && (
            <Field
              {...rest}
              component={TextInputField}
              name={`${name}.${language}`}
              helper={
                helperText || (helperKey && t(`${helperKey}.${language}`))
              }
              label={
                label || labelText || (labelKey && t(`${labelKey}.${language}`))
              }
              placeholder={
                placeholder ||
                (placeholderKey && t(`${placeholderKey}.${language}`))
              }
            />
          )
        );
      })}
    </div>
  );
};

export default MultiLanguageField;
