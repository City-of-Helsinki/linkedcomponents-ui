import { Field } from 'formik';
import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxGroupField from '../../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import { OptionType } from '../../../../types';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import {
  REGISTRATION_FIELDS,
  REGISTRATION_REQUIRED_FIELDS,
} from '../../constants';

interface Props {
  isEditingAllowed: boolean;
}

const RequiredFieldsSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  const participantBasicInfoOptions: OptionType[] = [
    REGISTRATION_REQUIRED_FIELDS.NAME,
    REGISTRATION_REQUIRED_FIELDS.CITY,
    REGISTRATION_REQUIRED_FIELDS.ADDRESS,
  ].map((value) => ({
    label: t(`registration.form.requiredFields.${camelCase(value)}`),
    value,
  }));

  const contactInfoOptions: OptionType[] = [
    REGISTRATION_REQUIRED_FIELDS.PHONE_NUMBER,
  ].map((value) => ({
    label: t(`registration.form.requiredFields.${camelCase(value)}`),
    value,
  }));

  return (
    <>
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
            options={participantBasicInfoOptions}
            name={REGISTRATION_FIELDS.REQUIRED_FIELDS}
          />
          <h3>{t('registration.form.titleContactInfo')}</h3>
          <Field
            component={CheckboxGroupField}
            columns={1}
            disabled={!isEditingAllowed}
            label={t('registration.form.titleContactInfo')}
            options={contactInfoOptions}
            name={REGISTRATION_FIELDS.REQUIRED_FIELDS}
          />
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default RequiredFieldsSection;
