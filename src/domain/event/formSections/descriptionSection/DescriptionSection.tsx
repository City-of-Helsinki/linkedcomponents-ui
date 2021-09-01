import { Field, useField, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextEditorField from '../../../../common/components/formFields/TextEditorField';
import TextInputField from '../../../../common/components/formFields/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import TabPanel from '../../../../common/components/tabs/TabPanel';
import Tabs from '../../../../common/components/tabs/Tabs';
import { CHARACTER_LIMITS } from '../../../../constants';
import lowerCaseFirstLetter from '../../../../utils/lowerCaseFirstLetter';
import { EVENT_FIELDS, EVENT_INFO_LANGUAGES } from '../../constants';
import styles from '../../eventPage.module.scss';
import useSortedInfoLanguages from '../../hooks/useSortedInfoLanguages';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';
import { formatSingleDescription } from '../../utils';

const FIELDS = [
  EVENT_FIELDS.DESCRIPTION,
  EVENT_FIELDS.NAME,
  EVENT_FIELDS.SHORT_DESCRIPTION,
];

export interface DescriptionSectionProps {
  selectedLanguage: EVENT_INFO_LANGUAGES;
  setSelectedLanguage: (value: EVENT_INFO_LANGUAGES) => void;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const { getFieldMeta } = useFormikContext();
  const { t } = useTranslation();
  const [{ value: eventInfoLanguages }] = useField<EVENT_INFO_LANGUAGES[]>({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });
  const [{ value: audience }] = useField({ name: EVENT_FIELDS.AUDIENCE });
  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const sortedEventInfoLanguages = useSortedInfoLanguages(eventInfoLanguages);

  const languageOptions = React.useMemo(
    () =>
      sortedEventInfoLanguages.map((language) => {
        const errors = FIELDS.map(
          (field) => getFieldMeta(`${field}.${language}`).error
        ).filter((e) => e);

        return {
          isCompleted: !errors.length,
          label: t(`form.language.${language}`),
          value: language,
        };
      }),
    [getFieldMeta, sortedEventInfoLanguages, t]
  );

  React.useEffect(() => {
    if (!eventInfoLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(eventInfoLanguages[0]);
    }
  }, [eventInfoLanguages, selectedLanguage, setSelectedLanguage]);

  const langText = lowerCaseFirstLetter(
    t(`form.inLanguage.${selectedLanguage}`)
  );

  const handleSelectedLanguageChange = (language: string) => {
    setSelectedLanguage(language as EVENT_INFO_LANGUAGES);
  };

  const sanitizeDescriptionAfterChange = React.useCallback(
    (value) =>
      formatSingleDescription({
        audience,
        description: value,
        lang: selectedLanguage,
      }),
    [audience, selectedLanguage]
  );

  return (
    <div>
      <Tabs
        name="description-language"
        onChange={handleSelectedLanguageChange}
        options={languageOptions}
        activeTab={selectedLanguage}
      >
        {languageOptions.map(({ value }) => {
          return (
            <TabPanel key={value}>
              <FieldRow
                notification={
                  <Notification
                    className={styles.notification}
                    label={t(`event.form.notificationTitleDescription.${type}`)}
                    type="info"
                  >
                    <p>{t(`event.form.infoTextDescription1.${type}`)}</p>
                    <p>{t(`event.form.infoTextDescription2.${type}`)}</p>
                  </Notification>
                }
              >
                <FieldColumn>
                  <FormGroup>
                    <Field
                      component={TextInputField}
                      label={t(`event.form.labelName.${type}`, {
                        langText,
                      })}
                      name={`${EVENT_FIELDS.NAME}.${selectedLanguage}`}
                      placeholder={t(`event.form.placeholderName.${type}`)}
                      required={true}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Field
                      component={TextInputField}
                      label={t(`event.form.labelShortDescription.${type}`, {
                        langText,
                      })}
                      name={`${EVENT_FIELDS.SHORT_DESCRIPTION}.${selectedLanguage}`}
                      placeholder={t(
                        `event.form.placeholderShortDescription.${type}`
                      )}
                      maxLength={CHARACTER_LIMITS.SHORT_STRING}
                      required={true}
                    />
                  </FormGroup>
                </FieldColumn>
              </FieldRow>
              <FormGroup>
                <Field
                  component={TextEditorField}
                  label={t(`event.form.labelDescription.${type}`, {
                    langText,
                  })}
                  name={`${EVENT_FIELDS.DESCRIPTION}.${selectedLanguage}`}
                  placeholder={t(`event.form.placeholderDescription.${type}`)}
                  sanitizeAfterChange={sanitizeDescriptionAfterChange}
                  maxLength={CHARACTER_LIMITS.LONG_STRING}
                  required={true}
                />
              </FormGroup>
            </TabPanel>
          );
        })}
      </Tabs>
    </div>
  );
};

export default DescriptionSection;
