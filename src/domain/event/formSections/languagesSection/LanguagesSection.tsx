import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import LanguageCheckboxGroupField from '../../../../common/components/formFields/LanguageCheckboxGroupField';
import InputRow from '../../../../common/components/inputRow/InputRow';
import LoadingSpinner from '../../../../common/components/loadingSpinner/LoadingSpinner';
import { useLanguagesQuery } from '../../../../schema';
import { OptionType } from '../../../../types';
import { EVENT_INFO_LANGUAGES } from '../../constants';
import styles from './languagesSection.module.scss';

const LanguagesSection = () => {
  const { t } = useTranslation();
  const { loading } = useLanguagesQuery();

  const eventInfoLanguageOptions: OptionType[] = EVENT_INFO_LANGUAGES.map(
    (type) => ({
      label: t(`event.language.${type}`),
      value: type,
    })
  );

  return (
    <LoadingSpinner isLoading={loading}>
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
    </LoadingSpinner>
  );
};

export default LanguagesSection;
