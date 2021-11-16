import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import RegistrationEventSelectorField from '../../../../common/components/formFields/RegistrationEventSelectorField';
import FieldColumn from '../../../app/layout/FieldColumn';
import FieldRow from '../../../app/layout/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';

const EventSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FieldRow>
      <FieldColumn>
        <Field
          name={REGISTRATION_FIELDS.EVENT}
          component={RegistrationEventSelectorField}
          label={t(`registration.form.labelEvent`)}
          placeholder={t(`registration.form.placeholderEvent`)}
        />
      </FieldColumn>
    </FieldRow>
  );
};

export default EventSection;
