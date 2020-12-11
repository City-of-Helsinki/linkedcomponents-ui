import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import MultiLanguageField from '../../../../common/components/formFields/MultiLanguageField';
import PlaceSelectorField from '../../../../common/components/formFields/PlaceSelectorField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import InputRow from '../../../../common/components/inputRow/InputRow';
import Notification from '../../../../common/components/notification/Notification';
import { CHARACTER_LIMITS, INPUT_MAX_WIDTHS } from '../../../../constants';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import { EVENT_FIELDS } from '../../constants';
import stylesEventPage from '../../eventPage.module.scss';
import InputWrapper from '../InputWrapper';
import styles from './placeSection.module.scss';

const PlaceSection = () => {
  const { t } = useTranslation();

  const [{ value: type }] = useField({
    name: EVENT_FIELDS.TYPE,
  });
  const [{ value: location }] = useField({
    name: EVENT_FIELDS.LOCATION,
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
            className={stylesEventPage.notification}
            label={t(`event.form.notificationTitleLocation`)}
            type="info"
          >
            <p>{t(`event.form.infoTextLocation1`)}</p>
            <p>{t(`event.form.infoTextLocation2.${type}`)}</p>
            <p>{t(`event.form.infoTextLocation3`)}</p>
            <p>{t(`event.form.infoTextLocation4`)}</p>
          </Notification>
        }
        infoColumns={4}
      >
        <InputWrapper maxWidth={INPUT_MAX_WIDTHS.LARGE}>
          <FormGroup>
            <Field
              component={PlaceSelectorField}
              label={t('event.form.labelLocation')}
              name={EVENT_FIELDS.LOCATION}
              placeholder={t('event.form.placeholderLocation')}
            />
            <div className={styles.locationId}>
              {t('event.form.labelLocationId')} {parseIdFromAtId(location)}
            </div>
          </FormGroup>
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
