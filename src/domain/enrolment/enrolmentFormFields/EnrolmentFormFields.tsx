import 'react-toastify/dist/ReactToastify.css';

import { Field, useField } from 'formik';
import { Fieldset } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxGroupField from '../../../common/components/formFields/CheckboxGroupField';
import PhoneInputField from '../../../common/components/formFields/PhoneInputField';
import SingleSelectField from '../../../common/components/formFields/SingleSelectField';
import TextAreaField from '../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import FormGroup from '../../../common/components/formGroup/FormGroup';
import { ENROLMENT_FIELDS, NOTIFICATIONS } from '../constants';
import useLanguageOptions from '../hooks/useLanguageOptions';
import useNotificationOptions from '../hooks/useNotificationOptions';
import useYearOptions from '../hooks/useYearOptions';
import styles from './enrolmentFormFields.module.scss';

interface Props {
  disabled?: boolean;
}

const EnrolmentForm: React.FC<Props> = ({ disabled }) => {
  const { t } = useTranslation();
  const notificationOptions = useNotificationOptions();
  const yearOptions = useYearOptions();
  const languageOptions = useLanguageOptions();

  const [{ value: notifications }] = useField<NOTIFICATIONS>({
    name: ENROLMENT_FIELDS.NOTIFICATIONS,
  });

  return (
    <>
      <Fieldset heading={t(`enrolment.form.titleBasicInfo`)}>
        <FormGroup>
          <Field
            name={ENROLMENT_FIELDS.NAME}
            component={TextInputField}
            disabled={disabled}
            label={t(`enrolment.form.labelName`)}
            placeholder={t(`enrolment.form.placeholderName`)}
            required
          />
        </FormGroup>
        <FormGroup>
          <div className={styles.streetAddressRow}>
            <Field
              name={ENROLMENT_FIELDS.STREET_ADDRESS}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelStreetAddress`)}
              placeholder={t(`enrolment.form.placeholderStreetAddress`)}
              required
            />
            <Field
              name={ENROLMENT_FIELDS.YEAR_OF_BIRTH}
              component={SingleSelectField}
              disabled={disabled}
              label={t(`enrolment.form.labelYearOfBirth`)}
              options={yearOptions}
              placeholder={t(`enrolment.form.placeholderYearOfBirth`)}
              required
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.zipRow}>
            <Field
              name={ENROLMENT_FIELDS.ZIP}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelZip`)}
              placeholder={t(`enrolment.form.placeholderZip`)}
              required
            />
            <Field
              name={ENROLMENT_FIELDS.CITY}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelCity`)}
              placeholder={t(`enrolment.form.placeholderCity`)}
              required
            />
          </div>
        </FormGroup>
      </Fieldset>

      <Fieldset heading={t(`enrolment.form.titleContactInfo`)}>
        <FormGroup>
          <div className={styles.emailRow}>
            <Field
              name={ENROLMENT_FIELDS.EMAIL}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelEmail`)}
              placeholder={t(`enrolment.form.placeholderEmail`)}
              required={notifications.includes(NOTIFICATIONS.EMAIL)}
            />
            <Field
              name={ENROLMENT_FIELDS.PHONE_NUMBER}
              component={PhoneInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelPhoneNumber`)}
              placeholder={t(`enrolment.form.placeholderPhoneNumber`)}
              type="tel"
              required={notifications.includes(NOTIFICATIONS.SMS)}
            />
          </div>
        </FormGroup>
      </Fieldset>

      <Fieldset heading={t(`enrolment.form.titleNotifications`)}>
        <FormGroup>
          <Field
            name={ENROLMENT_FIELDS.NOTIFICATIONS}
            className={styles.notifications}
            component={CheckboxGroupField}
            disabled={disabled}
            options={notificationOptions}
          />
        </FormGroup>
        <FormGroup>
          <div className={styles.notificationLanguageRow}>
            <Field
              name={ENROLMENT_FIELDS.NOTIFICATION_LANGUAGE}
              component={SingleSelectField}
              disabled={disabled}
              label={t(`enrolment.form.labelNotificationLanguage`)}
              options={languageOptions}
              placeholder={t(`enrolment.form.placeholderNotificationLanguage`)}
              required
            />
          </div>
        </FormGroup>
      </Fieldset>

      <Fieldset heading={t(`enrolment.form.titleAdditionalInfo`)}>
        <FormGroup>
          <div className={styles.membershipNumberRow}>
            <Field
              name={ENROLMENT_FIELDS.MEMBERSHIP_NUMBER}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelMembershipNumber`)}
              placeholder={t(`enrolment.form.placeholderMembershipNumber`)}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.nativeLanguageRow}>
            <Field
              name={ENROLMENT_FIELDS.NATIVE_LANGUAGE}
              component={SingleSelectField}
              disabled={disabled}
              label={t(`enrolment.form.labelNativeLanguage`)}
              options={languageOptions}
              placeholder={t(`enrolment.form.placeholderNativeLanguage`)}
              required
            />
            <Field
              name={ENROLMENT_FIELDS.SERVICE_LANGUAGE}
              component={SingleSelectField}
              disabled={disabled}
              label={t(`enrolment.form.labelServiceLanguage`)}
              options={languageOptions}
              placeholder={t(`enrolment.form.placeholderServiceLanguage`)}
              required
            />
          </div>
        </FormGroup>
        <FormGroup>
          <Field
            name={ENROLMENT_FIELDS.EXTRA_INFO}
            component={TextAreaField}
            disabled={disabled}
            label={t(`enrolment.form.labelExtraInfo`)}
            placeholder={t(`enrolment.form.placeholderExtraInfo`)}
          />
        </FormGroup>
      </Fieldset>
    </>
  );
};

export default EnrolmentForm;
