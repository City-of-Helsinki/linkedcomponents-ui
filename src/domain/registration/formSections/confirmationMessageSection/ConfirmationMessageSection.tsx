import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import TextAreaField from '../../../../common/components/formFields/textAreaField/TextAreaField';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';

interface Props {
  isEditingAllowed: boolean;
}

const ConfirmationMessageSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  return (
    <Fieldset
      heading={t('registration.form.sections.confirmationMessage')}
      hideLegend
    >
      <FieldRow>
        <FieldColumn>
          <Field
            component={TextAreaField}
            disabled={!isEditingAllowed}
            label={t(`registration.form.labelConfirmationMessage`)}
            name={REGISTRATION_FIELDS.CONFIRMATION_MESSAGE}
            placeholder={t(`registration.form.placeholderConfirmationMessage`)}
          />
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default ConfirmationMessageSection;
