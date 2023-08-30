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
import { NOTIFICATIONS, SIGNUP_GROUP_FIELDS } from '../../enrolment/constants';
import Divider from '../../enrolment/divider/Divider';
import useLanguageOptions from '../../enrolment/hooks/useLanguageOptions';
import useNotificationOptions from '../../enrolment/hooks/useNotificationOptions';
import { isSignupFieldRequired } from '../../enrolment/utils';
import styles from './signupGroupFormFields.module.scss';
import Signups from './signups/Signups';

interface Props {
  disabled?: boolean;
  registration: RegistrationFieldsFragment;
}

const SignupGroupFormFields: React.FC<Props> = ({ disabled, registration }) => {
  const { t } = useTranslation();
  const notificationOptions = useNotificationOptions();
  const languageOptions = useLanguageOptions();
  const serviceLanguageOptions = useLanguageOptions({
    variables: { serviceLanguage: true },
  });
  const [{ value: notifications }] = useField<NOTIFICATIONS>({
    name: SIGNUP_GROUP_FIELDS.NOTIFICATIONS,
  });

  return (
    <div className={styles.signupGroupFormFieldsFields}>
      <Signups disabled={disabled} registration={registration} />
      <h2>{t('enrolment.form.titleInformantInfo')}</h2>
      <Divider />
      <Fieldset heading={t(`enrolment.form.titleContactInfo`)}>
        <FormGroup>
          <div className={styles.emailRow}>
            <Field
              name={SIGNUP_GROUP_FIELDS.EMAIL}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelEmail`)}
              placeholder={t(`enrolment.form.placeholderEmail`)}
              required
            />
            <Field
              name={SIGNUP_GROUP_FIELDS.PHONE_NUMBER}
              component={PhoneInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelPhoneNumber`)}
              placeholder={t(`enrolment.form.placeholderPhoneNumber`)}
              type="tel"
              required={
                notifications.includes(NOTIFICATIONS.SMS) ||
                isSignupFieldRequired(
                  registration,
                  SIGNUP_GROUP_FIELDS.PHONE_NUMBER
                )
              }
            />
          </div>
        </FormGroup>
      </Fieldset>

      <Fieldset heading={t(`enrolment.form.titleNotifications`)}>
        <FormGroup>
          <Field
            name={SIGNUP_GROUP_FIELDS.NOTIFICATIONS}
            className={styles.notifications}
            component={CheckboxGroupField}
            // TODO: At the moment only email notifications are supported
            disabled={true}
            // disabled={disabled}
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
              name={SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER}
              component={TextInputField}
              disabled={disabled}
              label={t(`enrolment.form.labelMembershipNumber`)}
              placeholder={t(`enrolment.form.placeholderMembershipNumber`)}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER
              )}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.nativeLanguageRow}>
            <Field
              name={SIGNUP_GROUP_FIELDS.NATIVE_LANGUAGE}
              component={SingleSelectField}
              disabled={disabled}
              label={t(`enrolment.form.labelNativeLanguage`)}
              options={languageOptions}
              placeholder={t(`enrolment.form.placeholderNativeLanguage`)}
              required
            />
            <Field
              name={SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE}
              component={SingleSelectField}
              disabled={disabled}
              label={t(`enrolment.form.labelServiceLanguage`)}
              options={serviceLanguageOptions}
              placeholder={t(`enrolment.form.placeholderServiceLanguage`)}
              required
            />
          </div>
        </FormGroup>
        <FormGroup>
          <Field
            name={SIGNUP_GROUP_FIELDS.EXTRA_INFO}
            component={TextAreaField}
            disabled={disabled}
            label={t(`enrolment.form.labelExtraInfo`)}
            placeholder={t(`enrolment.form.placeholderExtraInfo`)}
            required={isSignupFieldRequired(
              registration,
              SIGNUP_GROUP_FIELDS.EXTRA_INFO
            )}
          />
        </FormGroup>
      </Fieldset>
    </div>
  );
};

export default SignupGroupFormFields;
