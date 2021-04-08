import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import MultiLanguageField from '../../../../common/components/formFields/MultiLanguageField';
import TextInputField from '../../../../common/components/formFields/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';

const ChannelsSection = () => {
  const { t } = useTranslation();
  const [{ value: type }] = useField(EVENT_FIELDS.TYPE);
  const [{ value: eventInfoLanguages }] = useField({
    name: EVENT_FIELDS.EVENT_INFO_LANGUAGES,
  });

  return (
    <>
      <h3>{t(`event.form.titleInfoUrl.${type}`)}</h3>
      <FieldRow>
        <FieldColumn>
          <FormGroup>
            <MultiLanguageField
              languages={eventInfoLanguages}
              labelKey={`event.form.labelInfoUrl.${type}`}
              name={EVENT_FIELDS.INFO_URL}
              placeholderKey={`event.form.placeholderInfoUrl.${type}`}
            />
          </FormGroup>
        </FieldColumn>
      </FieldRow>
      <h3>{t(`event.form.titleSocialMedia.${type}`)}</h3>
      <FieldRow
        notification={
          <Notification
            className={styles.notification}
            label={t(`event.form.titleSocialMedia.${type}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextSocialMedia.${type}`)}</p>
          </Notification>
        }
      >
        <FieldColumn>
          <FormGroup>
            <Field
              component={TextInputField}
              label={t(`event.form.labelFacebookUrl`)}
              name={EVENT_FIELDS.FACEBOOK_URL}
              placeholder={t(`event.form.placeholderFacebookUrl.${type}`)}
            />
          </FormGroup>
          <FormGroup>
            <Field
              component={TextInputField}
              label={t(`event.form.labelTwitterUrl`)}
              name={EVENT_FIELDS.TWITTER_URL}
              placeholder={t(`event.form.placeholderTwitterUrl.${type}`)}
            />
          </FormGroup>
          <FormGroup>
            <Field
              component={TextInputField}
              label={t(`event.form.labelInstagramUrl`)}
              name={EVENT_FIELDS.INSTAGRAM_URL}
              placeholder={t(`event.form.placeholderInstagramUrl.${type}`)}
            />
          </FormGroup>
        </FieldColumn>
      </FieldRow>
    </>
  );
};

export default ChannelsSection;
