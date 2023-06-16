import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import NumberInputField from '../../../../common/components/formFields/numberInputField/NumberInputField';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import SplittedRow from '../../../app/layout/splittedRow/SplittedRow';
import { REGISTRATION_FIELDS } from '../../constants';

interface Props {
  isEditingAllowed: boolean;
}

const GroupSizeSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  return (
    <Fieldset heading={t('registration.form.sections.groupSize')} hideLegend>
      <FieldRow>
        <FieldColumn>
          <SplittedRow>
            <Field
              component={NumberInputField}
              disabled={!isEditingAllowed}
              label={t(`registration.form.labelMaximumGroupSize`)}
              min={1}
              name={REGISTRATION_FIELDS.MAXIMUM_GROUP_SIZE}
              placeholder={0}
            />
          </SplittedRow>
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default GroupSizeSection;
