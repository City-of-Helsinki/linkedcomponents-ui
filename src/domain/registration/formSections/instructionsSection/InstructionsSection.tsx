import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextAreaField from '../../../../common/components/formFields/TextAreaField';
import FieldColumn from '../../../app/layout/FieldColumn';
import FieldRow from '../../../app/layout/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';

const InstructionsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FieldRow>
      <FieldColumn>
        <Field
          name={REGISTRATION_FIELDS.INSTRUCTIONS}
          component={TextAreaField}
          label={t(`registration.form.labelInstructions`)}
          placeholder={t(`registration.form.placeholderInstructions`)}
        />
      </FieldColumn>
    </FieldRow>
  );
};

export default InstructionsSection;
