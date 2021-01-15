import { Field, useField, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextAreaField from '../../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../../common/components/formFields/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import TabPanel from '../../../../common/components/tabs/TabPanel';
import Tabs from '../../../../common/components/tabs/Tabs';
import { CHARACTER_LIMITS } from '../../../../constants';
import lowerCaseFirstLetter from '../../../../utils/lowerCaseFirstLetter';
import {
  EVENT_FIELDS,
  EVENT_INFO_LANGUAGES,
  ORDERED_EVENT_INFO_LANGUAGES,
} from '../../constants';
import styles from '../../eventPage.module.scss';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';

const FIELDS = [
  EVENT_FIELDS.DESCRIPTION,
  EVENT_FIELDS.INFO_URL,
  EVENT_FIELDS.NAME,
  EVENT_FIELDS.SHORT_DESCRIPTION,
];

const DescriptionSection = () => {
  const { getFieldMeta } = useFormikContext();
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

  const langText = lowerCaseFirstLetter(
    t(`form.inLanguage.${selectedLanguage}`)
  );

  const languageOptions = React.useMemo(
    () =>
      eventInfoLanguages
        .map((language) => {
          const errors = FIELDS.map(
            (field) => getFieldMeta(`${field}.${language}`).error
          ).filter((e) => e);

          return {
            isCompleted: !errors.length,
            label: t(`form.language.${language}`),
            value: language,
          };
        })
        .sort(
          (a, b) =>
            ORDERED_EVENT_INFO_LANGUAGES.indexOf(a.value) -
            ORDERED_EVENT_INFO_LANGUAGES.indexOf(b.value)
        ),
    [eventInfoLanguages, getFieldMeta, t]
  );

  const handleSelectedLanguageChange = (language: string) => {
    setSelectedLanguage(language as EVENT_INFO_LANGUAGES);
  };

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
                    <p>{t(`event.form.infoTextDescription`)}</p>
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
                      label={t(`event.form.labelInfoUrl.${type}`, {
                        langText,
                      })}
                      name={`${EVENT_FIELDS.INFO_URL}.${selectedLanguage}`}
                      placeholder={t(`event.form.placeholderInfoUrl.${type}`)}
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
                  <FormGroup>
                    <Field
                      component={TextAreaField}
                      label={t(`event.form.labelDescription.${type}`, {
                        langText,
                      })}
                      name={`${EVENT_FIELDS.DESCRIPTION}.${selectedLanguage}`}
                      placeholder={t(
                        `event.form.placeholderDescription.${type}`
                      )}
                      maxLength={CHARACTER_LIMITS.LONG_STRING}
                      required={true}
                    />
                  </FormGroup>
                </FieldColumn>
              </FieldRow>
            </TabPanel>
          );
        })}
      </Tabs>
    </div>
  );
};

export default DescriptionSection;
