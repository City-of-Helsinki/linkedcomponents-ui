import {
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikTouched,
} from 'formik';
import forEach from 'lodash/forEach';
import set from 'lodash/set';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import Button from '../../../common/components/button/Button';
import TextAreaField from '../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import FormGroup from '../../../common/components/formGroup/FormGroup';
import Notification from '../../../common/components/notification/Notification';
import {
  usePostFeedbackMutation,
  usePostGuestFeedbackMutation,
} from '../../../generated/graphql';
import { VALIDATION_MESSAGE_KEYS } from '../../app/i18n/constants';
import PageWrapper from '../../app/layout/PageWrapper';
import { authenticatedSelector } from '../../auth/selectors';
import styles from './contactPage.module.scss';

enum CONTACT_FORM_FIELD {
  BODY = 'body',
  EMAIL = 'email',
  NAME = 'name',
  SUBJECT = 'subject',
}

type ContactFormFields = {
  [CONTACT_FORM_FIELD.BODY]: string;
  [CONTACT_FORM_FIELD.EMAIL]: string;
  [CONTACT_FORM_FIELD.NAME]: string;
  [CONTACT_FORM_FIELD.SUBJECT]: string;
};

const initialValues = {
  [CONTACT_FORM_FIELD.BODY]: '',
  [CONTACT_FORM_FIELD.EMAIL]: '',
  [CONTACT_FORM_FIELD.NAME]: '',
  [CONTACT_FORM_FIELD.SUBJECT]: '',
};

export const validationSchema = Yup.object().shape({
  [CONTACT_FORM_FIELD.NAME]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [CONTACT_FORM_FIELD.EMAIL]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .email(VALIDATION_MESSAGE_KEYS.EMAIL),
  [CONTACT_FORM_FIELD.SUBJECT]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [CONTACT_FORM_FIELD.BODY]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
});

export const scrollToFirstError = ({
  error,
}: {
  error: Yup.ValidationError;
}): void => {
  forEach(error.inner, (e) => {
    const fieldId = e.path;
    const field = document.getElementById(fieldId);

    /* istanbul ignore else */
    if (field) {
      scroller.scrollTo(fieldId, {
        delay: 0,
        duration: 500,
        offset: -200,
        smooth: true,
      });

      field.focus();
      return false;
    }
  });
};

export const showErrors = ({
  error,
  setErrors,
  setTouched,
}: {
  error: Yup.ValidationError;
  setErrors: (errors: FormikErrors<ContactFormFields>) => void;
  setTouched: (
    touched: FormikTouched<ContactFormFields>,
    shouldValidate?: boolean
  ) => void;
}): void => {
  /* istanbul ignore else */
  if (error.name === 'ValidationError') {
    const newErrors = error.inner.reduce(
      (acc, e: Yup.ValidationError) => set(acc, e.path, e.errors[0]),
      {}
    );
    const touchedFields = error.inner.reduce(
      (acc, e: Yup.ValidationError) => set(acc, e.path, true),
      {}
    );

    setErrors(newErrors);
    setTouched(touchedFields);
    scrollToFirstError({ error });
  }
};

const ContactPage: React.FC = () => {
  const successId = uniqueId('contact-form-success-');
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);

  const [success, setSuccess] = React.useState(false);

  const [postFeedback] = usePostFeedbackMutation();
  const [postGuestFeedback] = usePostGuestFeedbackMutation();

  const submitContactForm = async (
    values: ContactFormFields,
    formikHelpers: Pick<
      FormikHelpers<ContactFormFields>,
      'resetForm' | 'validateForm'
    >
  ) => {
    const { resetForm, validateForm } = formikHelpers;

    try {
      if (authenticated) {
        await postFeedback({ variables: { input: values } });
      } else {
        await postGuestFeedback({ variables: { input: values } });
      }

      setSuccess(true);
      resetForm();
      validateForm();
    } catch (e) {
      setSuccess(false);
    }
  };

  return (
    <PageWrapper
      description="helpPage.contactPage.pageDescription"
      keywords={[
        'keywords.contact',
        'keywords.form',
        'keywords.bug',
        'keywords.report',
      ]}
      title="helpPage.contactPage.pageTitle"
    >
      <h1>{t('helpPage.contactPage.pageTitle')}</h1>

      <Formik
        initialValues={initialValues}
        onSubmit={submitContactForm}
        validationSchema={validationSchema}
        validateOnMount
        validateOnBlur
        validateOnChange
      >
        {({ resetForm, setErrors, setTouched, validateForm, values }) => {
          const clearErrors = () => {
            setErrors({});
          };

          const handleSubmit = async () => {
            try {
              setSuccess(false);
              clearErrors();

              await validationSchema.validate(values, {
                abortEarly: false,
              });

              submitContactForm(values, { resetForm, validateForm });
            } catch (error) {
              showErrors({
                error,
                setErrors,
                setTouched,
              });
            }
          };
          return (
            <Form className={styles.contactForm} noValidate>
              <h2>{t('helpPage.contactPage.titleContactInfo')}</h2>
              <FormGroup>
                <Field
                  component={TextInputField}
                  label={t('helpPage.contactPage.labelName')}
                  name={CONTACT_FORM_FIELD.NAME}
                  placeholder={t('helpPage.contactPage.placeholderName')}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Field
                  component={TextInputField}
                  label={t('helpPage.contactPage.labelEmail')}
                  name={CONTACT_FORM_FIELD.EMAIL}
                  placeholder={t('helpPage.contactPage.placeholderEmail')}
                  required
                />
              </FormGroup>
              <h2>{t('helpPage.contactPage.titleMessage')}</h2>
              <FormGroup>
                <Field
                  component={TextInputField}
                  label={t('helpPage.contactPage.labelSubject')}
                  name={CONTACT_FORM_FIELD.SUBJECT}
                  placeholder={t('helpPage.contactPage.placeholderSubject')}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Field
                  component={TextAreaField}
                  label={t('helpPage.contactPage.labelBody')}
                  name={CONTACT_FORM_FIELD.BODY}
                  placeholder={t('helpPage.contactPage.placeholderBody')}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Button onClick={() => handleSubmit()} fullWidth>
                  {t('helpPage.contactPage.buttonSend')}
                </Button>
              </FormGroup>

              <div id={successId}>
                {success && (
                  <Notification
                    label={t('helpPage.contactPage.titleSuccess')}
                    type="success"
                  >
                    {t('helpPage.contactPage.textSuccess')}
                  </Notification>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </PageWrapper>
  );
};

export default ContactPage;
