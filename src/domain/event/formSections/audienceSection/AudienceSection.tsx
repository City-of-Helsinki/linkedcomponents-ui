import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxGroupField from '../../../../common/components/formFields/CheckboxGroupField';
import Notification from '../../../../common/components/notification/Notification';
import { EVENT_FIELDS } from '../../constants';
import useAudienceOptions from '../../hooks/useAudienceOptions';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';

const AudienceSection: React.FC = () => {
  const { t } = useTranslation();

  const audienceOptions = useAudienceOptions();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });

  return (
    <>
      <FieldRow
        notification={
          <Notification label={t(`event.form.titleAudience`)} type="info">
            <p>{t(`event.form.infoTextAudience.${type}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <Field
            name={EVENT_FIELDS.AUDIENCE}
            component={CheckboxGroupField}
            columns={2}
            options={audienceOptions}
            visibleOptionAmount={10}
          />
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default AudienceSection;
