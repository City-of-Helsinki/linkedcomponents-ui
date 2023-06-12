import { Field, useField, useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import TextAreaField from '../../../../common/components/formFields/textAreaField/TextAreaField';
import TabPanel from '../../../../common/components/tabs/tabPanel/TabPanel';
import Tabs from '../../../../common/components/tabs/Tabs';
import { LE_DATA_LANGUAGES } from '../../../../constants';
import lowerCaseFirstLetter from '../../../../utils/lowerCaseFirstLetter';
import skipFalsyType from '../../../../utils/skipFalsyType';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import useLanguageTabOptions from '../../../event/hooks/useLanguageTabOptions';
import useSortedInfoLanguages from '../../../event/hooks/useSortedInfoLanguages';
import { REGISTRATION_FIELDS } from '../../constants';

const FIELDS = [
  REGISTRATION_FIELDS.CONFIRMATION_MESSAGE,
  REGISTRATION_FIELDS.INSTRUCTIONS,
];

export interface InstructionsSectionProps {
  isEditingAllowed: boolean;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({
  isEditingAllowed,
}) => {
  const { t } = useTranslation();

  const [{ value: infoLanguages }] = useField<LE_DATA_LANGUAGES[]>({
    name: REGISTRATION_FIELDS.INFO_LANGUAGES,
  });
  const sortedEventInfoLanguages = useSortedInfoLanguages(infoLanguages);
  const [selectedLanguage, setSelectedLanguage] = React.useState(
    sortedEventInfoLanguages[0]
  );

  const { getFieldMeta } = useFormikContext();
  const isLangCompleted = useCallback(
    (lng: LE_DATA_LANGUAGES) => {
      const hasErrors = FIELDS.map((field) => {
        const fieldMeta = getFieldMeta(`${field}.${lng}`);
        return !fieldMeta.value || !!fieldMeta.error;
      }).filter(skipFalsyType);

      return !hasErrors.length;
    },
    [getFieldMeta]
  );
  const tabOptions = useLanguageTabOptions(infoLanguages, isLangCompleted);

  React.useEffect(() => {
    if (!sortedEventInfoLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(sortedEventInfoLanguages[0]);
    }
  }, [selectedLanguage, setSelectedLanguage, sortedEventInfoLanguages]);

  const langText = lowerCaseFirstLetter(
    t(`form.inLanguage.${selectedLanguage}`)
  );

  return (
    <Fieldset heading={t('registration.form.sections.instructions')} hideLegend>
      <Tabs
        name="instructions-language"
        onChange={
          setSelectedLanguage as React.Dispatch<React.SetStateAction<string>>
        }
        options={tabOptions}
        activeTab={selectedLanguage}
      >
        {tabOptions.map(({ value }) => {
          return (
            <TabPanel key={value}>
              <FieldRow>
                <FieldColumn>
                  <Field
                    component={TextAreaField}
                    disabled={!isEditingAllowed}
                    label={t(`registration.form.labelInstructions`, {
                      langText,
                    })}
                    name={`${REGISTRATION_FIELDS.INSTRUCTIONS}.${selectedLanguage}`}
                    placeholder={t(`registration.form.placeholderInstructions`)}
                  />
                </FieldColumn>
              </FieldRow>

              <FieldRow>
                <FieldColumn>
                  <Field
                    component={TextAreaField}
                    disabled={!isEditingAllowed}
                    label={t(`registration.form.labelConfirmationMessage`, {
                      langText,
                    })}
                    name={`${REGISTRATION_FIELDS.CONFIRMATION_MESSAGE}.${selectedLanguage}`}
                    placeholder={t(
                      `registration.form.placeholderConfirmationMessage`
                    )}
                  />
                </FieldColumn>
              </FieldRow>
            </TabPanel>
          );
        })}
      </Tabs>
    </Fieldset>
  );
};

export default InstructionsSection;
