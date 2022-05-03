import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextAreaField from '../../../../common/components/formFields/TextAreaField';
import FieldColumn from '../../../app/layout/FieldColumn';
import FieldRow from '../../../app/layout/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';

interface Props {
  isEditingAllowed: boolean;
}

const InstructionsSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  return (
    <FieldRow>
      <FieldColumn>
        <Field
          component={TextAreaField}
          disabled={!isEditingAllowed}
          label={t(`registration.form.labelInstructions`)}
          name={REGISTRATION_FIELDS.INSTRUCTIONS}
          placeholder={t(`registration.form.placeholderInstructions`)}
        />
      </FieldColumn>
    </FieldRow>
  );
};

export default InstructionsSection;
