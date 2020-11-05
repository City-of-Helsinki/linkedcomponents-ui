import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import MultiLanguageField from '../../../../common/components/formFields/MultiLanguageField';
import InputRow from '../../../../common/components/inputRow/InputRow';
import Notification from '../../../../common/components/notification/Notification';
import { CHARACTER_LIMITS, INPUT_MAX_WIDTHS } from '../../../../constants';
import { EVENT_FIELDS } from '../../constants';
import InputWrapper from '../InputWrapper';
import styles from './placeSection.module.scss';

const PlaceSection = () => {
  const { t } = useTranslation();

  const [{ value: type }] = useField({
    name: EVENT_FIELDS.TYPE,
  });
  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });

  return (
    <>
      <h3>{t(`event.form.titleLocation`)}</h3>
      <InputRow
        info={
          <Notification
            className={styles.notification}
            label={t(`event.form.notificationTitleLocation`)}
            type="info"
          >
            <p>{t(`event.form.infoTextLocation1`)}</p>
            <p>{t(`event.form.infoTextLocation2.${type}`)}</p>
            <p>{t(`event.form.infoTextLocation3`)}</p>
            <p>{t(`event.form.infoTextLocation4`)}</p>
          </Notification>
        }
        infoWidth={4}
      >
        <InputWrapper
          columns={6}
          inputColumns={6}
          maxWidth={INPUT_MAX_WIDTHS.LARGE}
        >
          <h3>{t(`event.form.titleLocationExtraInfo`)}</h3>
          <MultiLanguageField
            labelKey={`event.form.labelLocationExtraInfo`}
            languages={eventInfoLanguages}
            maxLength={CHARACTER_LIMITS.SHORT_STRING}
            name={EVENT_FIELDS.LOCATION_EXTRA_INFO}
            placeholderKey={`event.form.placeholderLocationExtraInfo`}
          />
        </InputWrapper>
      </InputRow>
    </>
  );
};

export default PlaceSection;
