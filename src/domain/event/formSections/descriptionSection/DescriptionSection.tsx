import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextAreaField from '../../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../../common/components/formFields/TextInputField';
import FormLanguageSelector from '../../../../common/components/formLanguageSelector/FormLanguageSelector';
import { CHARACTER_LIMITS } from '../../../../constants';
import lowercaseFirstLetter from '../../../../utils/lowercaseFirstLetter';
import {
  EVENT_FIELDS,
  EVENT_INFO_LANGUAGES,
  ORDERED_EVENT_INFO_LANGUAGES,
} from '../../constants';
import styles from './descriptionSection.module.scss';

const DescriptionSection = () => {
  const { t } = useTranslation();
  const [{ value: eventInfoLanguages }] = useField<EVENT_INFO_LANGUAGES[]>({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });
  const [{ value: type }] = useField({
    name: EVENT_FIELDS.TYPE,
  });

  const [selectedLanguage, setSelectedLanguage] = React.useState(
    eventInfoLanguages[0]
  );

  React.useEffect(() => {
    if (!eventInfoLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(eventInfoLanguages[0]);
    }
  }, [eventInfoLanguages, selectedLanguage]);

  const langText = lowercaseFirstLetter(
    t(`event.inLanguage.${selectedLanguage}`)
  );

  const languageOptions = React.useMemo(
    () =>
      eventInfoLanguages
        .map((language) => ({
          label: t(`event.language.${language}`),
          value: language,
        }))
        .sort(
          (a, b) =>
            ORDERED_EVENT_INFO_LANGUAGES.indexOf(a.value) -
            ORDERED_EVENT_INFO_LANGUAGES.indexOf(b.value)
        ),
    [eventInfoLanguages, t]
  );

  const handleSelectedLanguageChange = (language: string) => {
    setSelectedLanguage(language as EVENT_INFO_LANGUAGES);
  };

  return (
    <div className={styles.descriptionSection}>
      <div className={styles.languageSelectorWrapper}>
        <h3>{t('event.form.titleLanguageVersions')}</h3>
        <FormLanguageSelector
          fields={[
            EVENT_FIELDS.DESCRIPTION,
            EVENT_FIELDS.INFO_URL,
            EVENT_FIELDS.NAME,
            EVENT_FIELDS.SHORT_DESCRIPTION,
          ]}
          onChange={handleSelectedLanguageChange}
          options={languageOptions}
          selectedLanguage={selectedLanguage}
        />
      </div>
      <div className={styles.formFieldsWrapper}>
        <h3>{t(`event.form.titleDescription.${type}`)}</h3>
        <div className={styles.splittedRow}>
          <div>
            <Field
              component={TextInputField}
              label={t(`event.form.labelName.${type}`, {
                langText,
              })}
              name={`${EVENT_FIELDS.NAME}.${selectedLanguage}`}
              placeholder={t(`event.form.placeholderName.${type}`)}
              required={true}
            />
          </div>
          <div>
            <Field
              component={TextInputField}
              label={t(`event.form.labelInfoUrl.${type}`, {
                langText,
              })}
              name={`${EVENT_FIELDS.INFO_URL}.${selectedLanguage}`}
              placeholder={t(`event.form.placeholderInfoUrl.${type}`)}
            />
          </div>
        </div>

        <div className={styles.row}>
          <Field
            component={TextInputField}
            label={t(`event.form.labelShortDescription.${type}`, {
              langText,
            })}
            name={`${EVENT_FIELDS.SHORT_DESCRIPTION}.${selectedLanguage}`}
            placeholder={t(`event.form.placeholderShortDescription.${type}`)}
            maxLength={CHARACTER_LIMITS.SHORT_STRING}
            required={true}
          />
        </div>
        <div className={styles.row}>
          <Field
            component={TextAreaField}
            label={t(`event.form.labelDescription.${type}`, {
              langText,
            })}
            name={`${EVENT_FIELDS.DESCRIPTION}.${selectedLanguage}`}
            placeholder={t(`event.form.placeholderDescription.${type}`)}
            maxLength={CHARACTER_LIMITS.LONG_STRING}
            required={true}
          />
        </div>
      </div>
    </div>
  );
};

export default DescriptionSection;
