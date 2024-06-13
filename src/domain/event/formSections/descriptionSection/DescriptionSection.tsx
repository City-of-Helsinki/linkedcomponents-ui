/* eslint-disable max-len */
import { Field, useField, useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxField from '../../../../common/components/formFields/checkboxField/CheckboxField';
import TextAreaField from '../../../../common/components/formFields/textAreaField/TextAreaField';
import TextEditorField from '../../../../common/components/formFields/textEditorField/TextEditorField';
import TextInputField from '../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import TabPanel from '../../../../common/components/tabs/tabPanel/TabPanel';
import Tabs from '../../../../common/components/tabs/Tabs';
import { LE_DATA_LANGUAGES } from '../../../../constants';
import lowerCaseFirstLetter from '../../../../utils/lowerCaseFirstLetter';
import skipFalsyType from '../../../../utils/skipFalsyType';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import useUser from '../../../user/hooks/useUser';
import { EVENT_FIELDS, EVENT_TEXT_FIELD_MAX_LENGTH } from '../../constants';
import useLanguageTabOptions from '../../hooks/useLanguageTabOptions';
import useSortedInfoLanguages from '../../hooks/useSortedInfoLanguages';
import {
  formatSingleDescription,
  showNotificationInstructions,
  showTooltipInstructions,
} from '../../utils';
import DescriptionInstructions from './descriptionInstructions/DescriptionInstructions';
import EnvironmentalCertificateInstructions from './environmentalCertificateInstruction/EnvironmentalCertificateInstructions';

const FIELDS = [
  EVENT_FIELDS.DESCRIPTION,
  EVENT_FIELDS.NAME,
  EVENT_FIELDS.SHORT_DESCRIPTION,
];

export interface DescriptionSectionProps {
  isEditingAllowed: boolean;
  isExternalUser: boolean;
  selectedLanguage: LE_DATA_LANGUAGES;
  setSelectedLanguage: (value: LE_DATA_LANGUAGES) => void;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  isEditingAllowed,
  isExternalUser,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const [{ value: eventInfoLanguages }] = useField<LE_DATA_LANGUAGES[]>({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });
  const [{ value: audience }] = useField({ name: EVENT_FIELDS.AUDIENCE });
  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: hasEnvironmentalCertificate }] = useField({
    name: EVENT_FIELDS.HAS_ENVIRONMENTAL_CERTIFICATE,
  });
  const [{ value: environmentalCertificate }] = useField({
    name: EVENT_FIELDS.ENVIRONMENTAL_CERTIFICATE,
  });

  const sortedEventInfoLanguages = useSortedInfoLanguages(eventInfoLanguages);

  const { getFieldMeta } = useFormikContext();
  const isLangCompleted = useCallback(
    (lng: LE_DATA_LANGUAGES) => {
      const errors = FIELDS.map(
        (field) => getFieldMeta(`${field}.${lng}`).error
      ).filter(skipFalsyType);

      return !!errors.length;
    },
    [getFieldMeta]
  );
  const languageOptions = useLanguageTabOptions(
    eventInfoLanguages,
    isLangCompleted
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
                  showNotificationInstructions(user) ? (
                    <Notification
                      label={t(
                        `event.form.notificationTitleDescription.${type}`
                      )}
                      type="info"
                    >
                      <DescriptionInstructions eventType={type} />
                    </Notification>
                  ) : undefined
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
                      component={TextAreaField}
                      disabled={!isEditingAllowed}
                      label={t(`event.form.labelShortDescription.${type}`, {
                        langText,
                      })}
                      maxLength={
                        EVENT_TEXT_FIELD_MAX_LENGTH[
                          EVENT_FIELDS.SHORT_DESCRIPTION
                        ]
                      }
                      name={`${EVENT_FIELDS.SHORT_DESCRIPTION}.${selectedLanguage}`}
                      placeholder={t(
                        `event.form.placeholderShortDescription.${type}`
                      )}
                      required={true}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Field
                      component={TextEditorField}
                      disabled={!isEditingAllowed}
                      label={t(`event.form.labelDescription.${type}`, {
                        langText,
                      })}
                      maxLength={
                        EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.DESCRIPTION]
                      }
                      name={`${EVENT_FIELDS.DESCRIPTION}.${selectedLanguage}`}
                      placeholder={t(
                        `event.form.placeholderDescription.${type}`
                      )}
                      required={true}
                      sanitizeAfterBlur={sanitizeDescription}
                    />
                  </FormGroup>
                </FieldColumn>
              </FieldRow>

              {isExternalUser && (
                <FieldRow
                  notification={
                    showNotificationInstructions(user) ? (
                      <Notification
                        label={t(
                          'event.form.notificationTitleEnvironmentalCertificate'
                        )}
                        type="info"
                      >
                        <EnvironmentalCertificateInstructions />
                      </Notification>
                    ) : undefined
                  }
                >
                  <FormGroup>
                    <Field
                      component={CheckboxField}
                      label={t('event.form.labelHasEnvironmentalCertificate')}
                      name={EVENT_FIELDS.HAS_ENVIRONMENTAL_CERTIFICATE}
                      disabled={!isEditingAllowed}
                      value={!!environmentalCertificate}
                    ></Field>
                  </FormGroup>
                  <FormGroup>
                    <FieldColumn>
                      <Field
                        component={TextInputField}
                        disabled={
                          !isEditingAllowed || !hasEnvironmentalCertificate
                        }
                        label={t('event.form.labelEnvironmentalCertificate')}
                        name={EVENT_FIELDS.ENVIRONMENTAL_CERTIFICATE}
                        required
                        {...(showTooltipInstructions(user)
                          ? {
                              tooltipButtonLabel: t('common.showInstructions'),
                              tooltipLabel: t(
                                'event.form.labelEnvironmentalCertificate'
                              ),
                              tooltipText: (
                                <EnvironmentalCertificateInstructions />
                              ),
                            }
                          : {})}
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
