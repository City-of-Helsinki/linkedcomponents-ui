import 'react-toastify/dist/ReactToastify.css';

import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../common/components/fieldset/Fieldset';
import CheckboxGroupField from '../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import PhoneInputField from '../../../common/components/formFields/phoneInputField/PhoneInputField';
import SingleSelectField from '../../../common/components/formFields/singleSelectField/SingleSelectField';
import TextAreaField from '../../../common/components/formFields/textAreaField/TextAreaField';
import TextInputField from '../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../common/components/formGroup/FormGroup';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import { ENROLMENT_FIELDS, NOTIFICATIONS } from '../constants';
import Divider from '../divider/Divider';
import useLanguageOptions from '../hooks/useLanguageOptions';
import useNotificationOptions from '../hooks/useNotificationOptions';
import { isEnrolmentFieldRequired } from '../utils';
import Attendees from './attendees/Attendees';
import styles from './enrolmentFormFields.module.scss';

interface Props {
  disabled?: boolean;
  registration: RegistrationFieldsFragment;
}

const EnrolmentForm: React.FC<Props> = ({ disabled, registration }) => {
  const { t } = useTranslation();
  const notificationOptions = useNotificationOptions();
  const languageOptions = useLanguageOptions();
  const [{ value: notifications }] = useField<NOTIFICATIONS>({
    name: ENROLMENT_FIELDS.NOTIFICATIONS,
  });

  return (
    <div className={styles.enrolmentFormFields}>
      <Attendees disabled={disabled} registration={registration} />
      <h2>{t('enrolment.form.titleInformantInfo')}</h2>
      <Divider />
      <Fieldset heading={t(`enrolment.form.titleContactInfo`)}>
        <FormGroup>
          <div className={styles.emailRow}>
            <Field
              name={ENROLMENT_FIELDS.EMAIL}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelEmail`)}
              placeholder={t(`enrolment.form.placeholderEmail`)}
              required
            />
            <Field
              name={ENROLMENT_FIELDS.PHONE_NUMBER}
              component={PhoneInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelPhoneNumber`)}
              placeholder={t(`enrolment.form.placeholderPhoneNumber`)}
              type="tel"
              required={
                notifications.includes(NOTIFICATIONS.SMS) ||
                isEnrolmentFieldRequired(
                  registration,
                  ENROLMENT_FIELDS.PHONE_NUMBER
                )
              }
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
            label={t(`enrolment.form.titleNotifications`)}
            options={notificationOptions}
            required
          />
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
              required={isEnrolmentFieldRequired(
                registration,
                ENROLMENT_FIELDS.MEMBERSHIP_NUMBER
              )}
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
            required={isEnrolmentFieldRequired(
              registration,
              ENROLMENT_FIELDS.EXTRA_INFO
            )}
          />
        </FormGroup>
      </Fieldset>
    </div>
  );
};

export default EnrolmentForm;
