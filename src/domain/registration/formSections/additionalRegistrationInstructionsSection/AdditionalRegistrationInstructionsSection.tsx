import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextAreaField from '../../../../common/components/formFields/TextAreaField';
import FieldColumn from '../../../app/layout/FieldColumn';
import FieldRow from '../../../app/layout/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';

const AdditionalRegistrationInstructionsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FieldRow>
      <FieldColumn>
        <Field
          name={REGISTRATION_FIELDS.REGISTRATION_INSTRUCTIONS}
          component={TextAreaField}
          label={t(`registration.form.labelRegistrationInstructions`)}
          placeholder={t(
            `registration.form.placeholderRegistrationInstructions`
          )}
          timeSelector={true}
        />
      </FieldColumn>
    </FieldRow>
  );
};

export default AdditionalRegistrationInstructionsSection;
