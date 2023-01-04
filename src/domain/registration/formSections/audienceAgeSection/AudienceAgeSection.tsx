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

const AudienceAgeSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  return (
    <Fieldset heading={t('registration.form.sections.audienceAge')} hideLegend>
      <FieldRow>
        <FieldColumn>
          <SplittedRow>
            <Field
              component={NumberInputField}
              disabled={!isEditingAllowed}
              label={t(`registration.form.labelAudienceMinAge`)}
              min={0}
              name={REGISTRATION_FIELDS.AUDIENCE_MIN_AGE}
              placeholder={0}
            />
            <Field
              component={NumberInputField}
              disabled={!isEditingAllowed}
              label={t(`registration.form.labelAudienceMaxAge`)}
              name={REGISTRATION_FIELDS.AUDIENCE_MAX_AGE}
              min={0}
              placeholder={0}
            />
          </SplittedRow>
        </FieldColumn>
      </FieldRow>
    </Fieldset>
  );
};

export default AudienceAgeSection;
