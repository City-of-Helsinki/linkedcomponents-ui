/* eslint-disable max-len */
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxGroupField from '../../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';
import useMandatoryFieldOptions from '../../hooks/useMandatoryFieldOptions';

interface Props {
  isEditingAllowed: boolean;
}

const MandatoryFieldsSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  const { contactMandatoryFieldOptions, personMandatoryFieldOptions } =
    useMandatoryFieldOptions();

  return (
    <Fieldset
      heading={t('registration.form.sections.mandatoryFields')}
      hideLegend
    >
      <FieldRow>
        <FieldColumn>
          <h3 style={{ marginTop: 0 }}>
            {t('registration.form.titleParticipantBasicInfo')}
          </h3>
          <Field
            component={CheckboxGroupField}
            columns={1}
            disabled={!isEditingAllowed}
            label={t('registration.form.titleParticipantBasicInfo')}
            options={personMandatoryFieldOptions}
            name={REGISTRATION_FIELDS.MANDATORY_FIELDS}
          />

          <h3>{t('registration.form.titleContactInfo')}</h3>
          <Field
            component={CheckboxGroupField}
            columns={1}
            disabled={!isEditingAllowed}
            label={t('registration.form.titleContactInfo')}
            options={contactMandatoryFieldOptions}
            name={REGISTRATION_FIELDS.MANDATORY_FIELDS}
          />
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default MandatoryFieldsSection;
