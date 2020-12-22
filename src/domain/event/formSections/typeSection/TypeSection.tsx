import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import RadioButtonGroupField from '../../../../common/components/formFields/RadioButtonGroupField';
import Notification from '../../../../common/components/notification/Notification';
import { OptionType } from '../../../../types';
import { EVENT_FIELDS, EVENT_TYPE } from '../../constants';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';

const TypeSection = () => {
  const { t } = useTranslation();

  const typeOptions: OptionType[] = [EVENT_TYPE.EVENT, EVENT_TYPE.COURSE].map(
    (type) => ({
      label: t(`event.type.${type}`),
      value: type,
    })
  );

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
            columns={3}
            component={RadioButtonGroupField}
            options={typeOptions}
          />
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default TypeSection;
