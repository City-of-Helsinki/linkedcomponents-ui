import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import LanguageCheckboxGroupField from '../../../../common/components/formFields/LanguageCheckboxGroupField';
import InputRow from '../../../../common/components/inputRow/InputRow';
import { OptionType } from '../../../../types';
import { EVENT_INFO_LANGUAGES } from '../../constants';
import styles from './languagesSection.module.scss';

const LanguagesSection = () => {
  const { t } = useTranslation();
  const eventInfoLanguageOptions: OptionType[] = EVENT_INFO_LANGUAGES.map(
    (type) => ({
      label: t(`event.language.${type}`),
      value: type,
    })
  );

  return (
    <>
      <h2>{t('event.form.titleEventInfoLanguages')}</h2>
      <InputRow>
        <div className={styles.eventInfoLanguageCheckboxes}>
          <Field
            name="eventInfoLanguages"
            component={LanguageCheckboxGroupField}
            options={eventInfoLanguageOptions}
          />
        </div>
      </InputRow>
    </>
  );
};

export default LanguagesSection;
