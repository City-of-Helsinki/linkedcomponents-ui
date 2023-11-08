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
  SignupFieldsFragment,
  SignupGroupFieldsFragment,
} from '../../../generated/graphql';
import useLanguageOptions from '../../language/hooks/useLanguageOptions';
import {
  CONTACT_PERSON_FIELDS,
  NOTIFICATIONS,
  SIGNUP_GROUP_FIELDS,
} from '../constants';
import Divider from '../divider/Divider';
import useNotificationOptions from '../hooks/useNotificationOptions';
import { isSignupFieldRequired } from '../utils';
import styles from './signupGroupFormFields.module.scss';
import Signups from './signups/Signups';

interface Props {
  disabled?: boolean;
  registration: RegistrationFieldsFragment;
  signup?: SignupFieldsFragment;
  signupGroup?: SignupGroupFieldsFragment;
}

const SignupGroupFormFields: React.FC<Props> = ({
  disabled,
  registration,
  signup,
  signupGroup,
}) => {
  const { t } = useTranslation();
  const notificationOptions = useNotificationOptions();
  const languageOptions = useLanguageOptions();
  const serviceLanguageOptions = useLanguageOptions({
    variables: { serviceLanguage: true },
  });

  const getContactPersonFieldName = (name: string) =>
    `${SIGNUP_GROUP_FIELDS.CONTACT_PERSON}.${name}`;

  const getContactPersonTranslation = (key: string) =>
    t(`signup.form.contactPerson.${key}`);

  const [{ value: notifications }] = useField<NOTIFICATIONS>({
    name: getContactPersonFieldName(CONTACT_PERSON_FIELDS.NOTIFICATIONS),
  });

  return (
    <div className={styles.signupGroupFormFieldsFields}>
      <Signups
        disabled={disabled}
        registration={registration}
        signupGroup={signupGroup}
      />
      <h2>{getContactPersonTranslation('titleContactPersonInfo')}</h2>
      <Divider />
      <Fieldset heading={getContactPersonTranslation(`titleContactInfo`)}>
        <FormGroup>
          <div className={styles.emailRow}>
            <Field
              name={getContactPersonFieldName(CONTACT_PERSON_FIELDS.EMAIL)}
              component={TextInputField}
              disabled={disabled}
              label={getContactPersonTranslation('labelEmail')}
              placeholder={getContactPersonTranslation('placeholderEmail')}
              required
            />
            <Field
              name={getContactPersonFieldName(
                CONTACT_PERSON_FIELDS.PHONE_NUMBER
              )}
              component={PhoneInputField}
              disabled={disabled}
              label={getContactPersonTranslation('labelPhoneNumber')}
              placeholder={getContactPersonTranslation(
                'placeholderPhoneNumber'
              )}
              type="tel"
              required={
                notifications.includes(NOTIFICATIONS.SMS) ||
                isSignupFieldRequired(
                  registration,
                  CONTACT_PERSON_FIELDS.PHONE_NUMBER
                )
              }
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.nameRow}>
            <Field
              name={getContactPersonFieldName(CONTACT_PERSON_FIELDS.FIRST_NAME)}
              component={TextInputField}
              disabled={disabled}
              label={getContactPersonTranslation('labelFirstName')}
              placeholder={getContactPersonTranslation('placeholderFirstName')}
              required={isSignupFieldRequired(
                registration,
                CONTACT_PERSON_FIELDS.FIRST_NAME
              )}
            />
            <Field
              name={getContactPersonFieldName(CONTACT_PERSON_FIELDS.LAST_NAME)}
              component={TextInputField}
              disabled={disabled}
              label={getContactPersonTranslation('labelLastName')}
              placeholder={getContactPersonTranslation('placeholderLastName')}
              required={isSignupFieldRequired(
                registration,
                CONTACT_PERSON_FIELDS.LAST_NAME
              )}
            />
          </div>
        </FormGroup>
      </Fieldset>

      <Fieldset heading={getContactPersonTranslation(`titleNotifications`)}>
        <FormGroup>
          <Field
            name={getContactPersonFieldName(
              CONTACT_PERSON_FIELDS.NOTIFICATIONS
            )}
            className={styles.notifications}
            component={CheckboxGroupField}
            disabled={true}
            label={getContactPersonTranslation(`titleNotifications`)}
            options={notificationOptions}
            required
          />
        </FormGroup>
      </Fieldset>

      <Fieldset heading={getContactPersonTranslation(`titleAdditionalInfo`)}>
        <FormGroup>
          <div className={styles.membershipNumberRow}>
            <Field
              name={getContactPersonFieldName(
                CONTACT_PERSON_FIELDS.MEMBERSHIP_NUMBER
              )}
              component={TextInputField}
              disabled={disabled}
              label={getContactPersonTranslation('labelMembershipNumber')}
              placeholder={getContactPersonTranslation(
                'placeholderMembershipNumber'
              )}
              required={isSignupFieldRequired(
                registration,
                CONTACT_PERSON_FIELDS.MEMBERSHIP_NUMBER
              )}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className={styles.nativeLanguageRow}>
            <Field
              name={getContactPersonFieldName(
                CONTACT_PERSON_FIELDS.NATIVE_LANGUAGE
              )}
              component={SingleSelectField}
              disabled={disabled}
              label={getContactPersonTranslation('labelNativeLanguage')}
              options={languageOptions}
              placeholder={getContactPersonTranslation(
                'placeholderNativeLanguage'
              )}
              required
            />
            <Field
              name={getContactPersonFieldName(
                CONTACT_PERSON_FIELDS.SERVICE_LANGUAGE
              )}
              component={SingleSelectField}
              disabled={disabled}
              label={getContactPersonTranslation('labelServiceLanguage')}
              options={serviceLanguageOptions}
              placeholder={getContactPersonTranslation(
                'placeholderServiceLanguage'
              )}
              required
            />
          </div>
        </FormGroup>
        {/* Don't show signup group extra info field when editing a single signup */}
        {!signup && (
          <FormGroup>
            <Field
              name={SIGNUP_GROUP_FIELDS.EXTRA_INFO}
              component={TextAreaField}
              disabled={disabled}
              label={t('signup.form.labelExtraInfo')}
              placeholder={t('signup.form.placeholderExtraInfo')}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_GROUP_FIELDS.EXTRA_INFO
              )}
            />
          </FormGroup>
        )}
      </Fieldset>
    </div>
  );
};

export default SignupGroupFormFields;
