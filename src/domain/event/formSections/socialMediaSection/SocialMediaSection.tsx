import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextInputField from '../../../../common/components/formFields/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import InputRow from '../../../../common/components/inputRow/InputRow';
import Notification from '../../../../common/components/notification/Notification';
import { INPUT_MAX_WIDTHS } from '../../../../constants';
import { EVENT_FIELDS } from '../../constants';
import styles from '../../eventPage.module.scss';
import InputWrapper from '../InputWrapper';

const SocialMediaSection = () => {
  const { t } = useTranslation();
  const [{ value: type }] = useField(EVENT_FIELDS.TYPE);

  return (
    <>
      <h3>{t(`event.form.titleSocialMedia.${type}`)}</h3>
      <InputRow
        info={
          <Notification
            className={styles.notification}
            label={t(`event.form.titleSocialMedia.${type}`)}
            type="info"
          >
            <p>{t(`event.form.infoTextSocialMedia.${type}`)}</p>
          </Notification>
        }
      >
        <InputWrapper maxWidth={INPUT_MAX_WIDTHS.LARGE}>
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
        </InputWrapper>
      </InputRow>
    </>
  );
};

export default SocialMediaSection;
