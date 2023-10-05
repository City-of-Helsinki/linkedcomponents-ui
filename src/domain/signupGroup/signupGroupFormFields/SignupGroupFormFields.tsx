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
import {
  RegistrationFieldsFragment,
  SignupGroupFieldsFragment,
} from '../../../generated/graphql';
import useLanguageOptions from '../../language/hooks/useLanguageOptions';
import { NOTIFICATIONS, SIGNUP_GROUP_FIELDS } from '../constants';
import Divider from '../divider/Divider';
import useNotificationOptions from '../hooks/useNotificationOptions';
import { isSignupFieldRequired } from '../utils';
import styles from './signupGroupFormFields.module.scss';
import Signups from './signups/Signups';

interface Props {
  disabled?: boolean;
  registration: RegistrationFieldsFragment;
  signupGroup?: SignupGroupFieldsFragment;
}

const SignupGroupFormFields: React.FC<Props> = ({
  disabled,
  registration,
  signupGroup,
}) => {
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
      <Signups
        disabled={disabled}
        registration={registration}
        signupGroup={signupGroup}
      />
      <h2>{t('signup.form.titleInformantInfo')}</h2>
      <Divider />
      <Fieldset heading={t(`signup.form.titleContactInfo`)}>
        <FormGroup>
          <div className={styles.emailRow}>
            <Field
              name={SIGNUP_GROUP_FIELDS.EMAIL}
              component={TextInputField}
              disabled={disabled}
              label={t(`signup.form.labelEmail`)}
              placeholder={t(`signup.form.placeholderEmail`)}
              required
            />
            <Field
              name={SIGNUP_GROUP_FIELDS.PHONE_NUMBER}
              component={PhoneInputField}
              disabled={disabled}
              label={t(`signup.form.labelPhoneNumber`)}
              placeholder={t(`signup.form.placeholderPhoneNumber`)}
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

      <Fieldset heading={t(`signup.form.titleNotifications`)}>
        <FormGroup>
          <Field
            name={SIGNUP_GROUP_FIELDS.NOTIFICATIONS}
            className={styles.notifications}
            component={CheckboxGroupField}
            // TODO: At the moment only email notifications are supported
            disabled={true}
            // disabled={disabled}
            label={t(`signup.form.titleNotifications`)}
            options={notificationOptions}
            required
          />
        </FormGroup>
      </Fieldset>

      <Fieldset heading={t(`signup.form.titleAdditionalInfo`)}>
        <FormGroup>
          <div className={styles.membershipNumberRow}>
            <Field
              name={SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER}
              component={TextInputField}
              disabled={disabled}
              label={t(`signup.form.labelMembershipNumber`)}
              placeholder={t(`signup.form.placeholderMembershipNumber`)}
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
              label={t(`signup.form.labelNativeLanguage`)}
              options={languageOptions}
              placeholder={t(`signup.form.placeholderNativeLanguage`)}
              required
            />
            <Field
              name={SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE}
              component={SingleSelectField}
              disabled={disabled}
              label={t(`signup.form.labelServiceLanguage`)}
              options={serviceLanguageOptions}
              placeholder={t(`signup.form.placeholderServiceLanguage`)}
              required
            />
          </div>
        </FormGroup>
        <FormGroup>
          <Field
            name={SIGNUP_GROUP_FIELDS.EXTRA_INFO}
            component={TextAreaField}
            disabled={disabled}
            label={t(`signup.form.labelExtraInfo`)}
            placeholder={t(`signup.form.placeholderExtraInfo`)}
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
