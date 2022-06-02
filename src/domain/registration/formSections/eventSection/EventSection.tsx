import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import RegistrationEventSelectorField from '../../../../common/components/formFields/RegistrationEventSelectorField';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';

interface Props {
  isEditingAllowed: boolean;
}

const EventSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  return (
    <FieldRow>
      <FieldColumn>
        <Field
          component={RegistrationEventSelectorField}
          disabled={!isEditingAllowed}
          label={t(`registration.form.labelEvent`)}
          name={REGISTRATION_FIELDS.EVENT}
          placeholder={t(`registration.form.placeholderEvent`)}
        />
      </FieldColumn>
    </FieldRow>
  );
};

export default EventSection;
