import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import RadioButtonGroupField from '../../../../common/components/formFields/RadioButtonGroupField';
import InputRow from '../../../../common/components/inputRow/InputRow';
import Notification from '../../../../common/components/notification/Notification';
import { INPUT_MAX_WIDTHS } from '../../../../constants';
import { OptionType } from '../../../../types';
import { EVENT_FIELDS, EVENT_TYPE } from '../../constants';
import InputWrapper from '../InputWrapper';

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
      <InputRow
        info={
          <Notification
            label={t('event.form.notificationTitleType')}
            type="info"
          >
            <p>{t('event.form.infoTextType1')}</p>
            <p>{t('event.form.infoTextType2')}</p>
          </Notification>
        }
        infoColumns={4}
      >
        <InputWrapper maxWidth={INPUT_MAX_WIDTHS.MEDIUM}>
          <Field
            name={EVENT_FIELDS.TYPE}
            columns={3}
            component={RadioButtonGroupField}
            options={typeOptions}
          />
        </InputWrapper>
      </InputRow>
    </>
  );
};

export default TypeSection;
