import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import RadioButtonGroupField from '../../../../common/components/formFields/RadioButtonGroupField';
import Notification from '../../../../common/components/notification/Notification';
import { EVENT_FIELDS } from '../../constants';
import useEventTypeOptions from '../../hooks/useEventTypeOptions';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';

const TypeSection = () => {
  const { t } = useTranslation();
  const typeOptions = useEventTypeOptions();

  return (
    <>
      <h3>{t('event.form.titleEventType')}</h3>
      <FieldRow
        notification={
          <Notification
            label={t('event.form.notificationTitleType')}
            type="info"
          >
            <p>{t('event.form.infoTextType1')}</p>
            <p>{t('event.form.infoTextType2')}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <Field
            name={EVENT_FIELDS.TYPE}
            columns={1}
            component={RadioButtonGroupField}
            options={typeOptions}
          />
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default TypeSection;
