import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxGroupField from '../../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import { ORDERED_LE_DATA_LANGUAGES } from '../../../../constants';
import { OptionType } from '../../../../types';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';

interface Props {
  isEditingAllowed: boolean;
}

const LanguagesSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  const eventInfoLanguageOptions: OptionType[] = ORDERED_LE_DATA_LANGUAGES.map(
    (type) => ({
      label: t(`form.language.${type}`),
      value: type,
    })
  );

  return (
    <Fieldset heading={t('registration.form.sections.languages')} hideLegend>
      <h3>{t(`registration.form.titleInfoLanguages`)}</h3>
      <FieldRow>
        <FieldColumn>
          <Field
            component={CheckboxGroupField}
            columns={3}
            disabled={!isEditingAllowed}
            label={t(`registration.form.titleInfoLanguages`)}
            min={1}
            name={REGISTRATION_FIELDS.INFO_LANGUAGES}
            options={eventInfoLanguageOptions}
            required
          />
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default LanguagesSection;
