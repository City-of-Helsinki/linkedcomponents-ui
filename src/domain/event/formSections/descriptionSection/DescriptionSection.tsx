import { Field, useField, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextEditorField from '../../../../common/components/formFields/textEditorField/TextEditorField';
import TextInputField from '../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import TabPanel from '../../../../common/components/tabs/tabPanel/TabPanel';
import Tabs from '../../../../common/components/tabs/Tabs';
import { CHARACTER_LIMITS, LE_DATA_LANGUAGES } from '../../../../constants';
import lowerCaseFirstLetter from '../../../../utils/lowerCaseFirstLetter';
import skipFalsyType from '../../../../utils/skipFalsyType';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import useSortedInfoLanguages from '../../hooks/useSortedInfoLanguages';
import { formatSingleDescription } from '../../utils';

const FIELDS = [
  EVENT_FIELDS.DESCRIPTION,
  EVENT_FIELDS.NAME,
  EVENT_FIELDS.SHORT_DESCRIPTION,
];

export interface DescriptionSectionProps {
  isEditingAllowed: boolean;
  selectedLanguage: LE_DATA_LANGUAGES;
  setSelectedLanguage: (value: LE_DATA_LANGUAGES) => void;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  isEditingAllowed,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const { getFieldMeta } = useFormikContext();
  const { t } = useTranslation();
  const [{ value: eventInfoLanguages }] = useField<LE_DATA_LANGUAGES[]>({
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
        ).filter(skipFalsyType);

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
    setSelectedLanguage(language as LE_DATA_LANGUAGES);
  };

  const sanitizeDescription = React.useCallback(
    (value: string) =>
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
                    <p
                      dangerouslySetInnerHTML={{
                        __html: t(`event.form.infoTextDescription3.${type}`, {
                          openInNewTab: t('common.openInNewTab'),
                        }),
                      }}
                    />
                  </Notification>
                }
              >
                <FieldColumn>
                  <FormGroup>
                    <Field
                      component={TextInputField}
                      disabled={!isEditingAllowed}
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
                      disabled={!isEditingAllowed}
                      label={t(`event.form.labelShortDescription.${type}`, {
                        langText,
                      })}
                      maxLength={CHARACTER_LIMITS.SHORT_STRING}
                      name={`${EVENT_FIELDS.SHORT_DESCRIPTION}.${selectedLanguage}`}
                      placeholder={t(
                        `event.form.placeholderShortDescription.${type}`
                      )}
                      required={true}
                    />
                  </FormGroup>
                </FieldColumn>
              </FieldRow>
              <FormGroup>
                <Field
                  component={TextEditorField}
                  disabled={!isEditingAllowed}
                  label={t(`event.form.labelDescription.${type}`, {
                    langText,
                  })}
                  maxLength={CHARACTER_LIMITS.LONG_STRING}
                  name={`${EVENT_FIELDS.DESCRIPTION}.${selectedLanguage}`}
                  placeholder={t(`event.form.placeholderDescription.${type}`)}
                  required={true}
                  sanitizeAfterBlur={sanitizeDescription}
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
