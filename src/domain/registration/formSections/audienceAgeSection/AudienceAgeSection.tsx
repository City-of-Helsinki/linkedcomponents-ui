import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import NumberInputField from '../../../../common/components/formFields/NumberInputField';
import FieldColumn from '../../../app/layout/FieldColumn';
import FieldRow from '../../../app/layout/FieldRow';
import { REGISTRATION_FIELDS } from '../../constants';
import styles from '../../registrationPage.module.scss';

const AudienceAgeSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <FieldRow>
        <FieldColumn>
          <div className={styles.splittedRow}>
            <Field
              name={REGISTRATION_FIELDS.AUDIENCE_MIN_AGE}
              component={NumberInputField}
              label={t(`registration.form.labelAudienceMinAge`)}
              min={0}
              placeholder={0}
            />
            <Field
              name={REGISTRATION_FIELDS.AUDIENCE_MAX_AGE}
              component={NumberInputField}
              label={t(`registration.form.labelAudienceMaxAge`)}
              min={0}
              placeholder={0}
            />
          </div>
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default AudienceAgeSection;
