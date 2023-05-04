import { Field, useField, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxField from '../../../../common/components/formFields/checkboxField/CheckboxField';
// eslint-disable-next-line max-len
import RadioButtonGroupField from '../../../../common/components/formFields/radioButtonGroupField/RadioButtonGroupField';
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
import useSortedInfoLanguages from '../../hooks/useSortedInfoLanguages';
import { formatSingleDescription } from '../../utils';

const FIELDS = [
  EVENT_FIELDS.DESCRIPTION,
  EVENT_FIELDS.NAME,
  EVENT_FIELDS.SHORT_DESCRIPTION,
];

export interface DescriptionSectionProps {
  isEditingAllowed: boolean;
  isUserOtherOrganisation: boolean;
  selectedLanguage: LE_DATA_LANGUAGES;
  setSelectedLanguage: (value: LE_DATA_LANGUAGES) => void;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  isEditingAllowed,
  isUserOtherOrganisation,
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
  const [{ value: hasEnvironmentalCertificate }] = useField({
    name: EVENT_FIELDS.HAS_ENVIRONMENTAL_CERTIFICATE,
  });

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
    if (!sortedEventInfoLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(sortedEventInfoLanguages[0]);
    }
  }, [selectedLanguage, setSelectedLanguage, sortedEventInfoLanguages]);

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
    <Fieldset heading={t('event.form.sections.description')} hideLegend>
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
              {isUserOtherOrganisation && (
                <FieldRow>
                  <FormGroup>
                    <Field
                      component={CheckboxField}
                      label={t('event.form.labelHasEnvironmentalCertificate')}
                      name="hasEnvironmentalCertificate"
                    ></Field>
                  </FormGroup>
                  <FormGroup>
                    <FieldColumn>
                      <Field
                        component={TextInputField}
                        disabled={!hasEnvironmentalCertificate}
                        label={t('event.form.labelCertificate')}
                        name={EVENT_FIELDS.ENVIRONMENTAL_CERTIFICATE}
                        required
                      ></Field>
                    </FieldColumn>
                  </FormGroup>
                </FieldRow>
              )}
            </TabPanel>
          );
        })}
      </Tabs>
    </Fieldset>
  );
};

export default DescriptionSection;
