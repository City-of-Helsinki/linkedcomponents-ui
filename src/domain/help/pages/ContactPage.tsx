import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import Button from '../../../common/components/button/Button';
import TextAreaField from '../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import FormGroup from '../../../common/components/formGroup/FormGroup';
import { VALIDATION_MESSAGE_KEYS } from '../../app/i18n/constants';
import PageWrapper from '../../app/layout/PageWrapper';
import styles from './contactPage.module.scss';

enum CONTACT_FORM_FIELD {
  EMAIL = 'email',
  FEEDBACK = 'feedback',
  NAME = 'name',
}

const initialValues = {
  [CONTACT_FORM_FIELD.EMAIL]: '',
  [CONTACT_FORM_FIELD.FEEDBACK]: '',
  [CONTACT_FORM_FIELD.NAME]: '',
};

export const validationSchema = Yup.object().shape({
  [CONTACT_FORM_FIELD.EMAIL]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .email(VALIDATION_MESSAGE_KEYS.EMAIL),
  [CONTACT_FORM_FIELD.FEEDBACK]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [CONTACT_FORM_FIELD.NAME]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
});

const ContactPage = () => {
  const { t } = useTranslation();
  return (
    <PageWrapper title="helpPage.contactPage.pageTitle">
      <h1>{t('helpPage.contactPage.pageTitle')}</h1>
      <p>{t('helpPage.contactPage.text')}</p>
      <Formik
        initialValues={initialValues}
        onSubmit={() => alert('TODO: Send feedback form')}
        validationSchema={validationSchema}
        validateOnMount
        validateOnBlur
        validateOnChange
      >
        {() => {
          return (
            <Form className={styles.contactForm} noValidate>
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
              <FormGroup>
                <Field
                  component={TextAreaField}
                  label={t('helpPage.contactPage.labelFeedback')}
                  name={CONTACT_FORM_FIELD.FEEDBACK}
                  placeholder={t('helpPage.contactPage.placeholderFeedback')}
                  required
                />
              </FormGroup>

              <Button type="submit" fullWidth>
                {t('helpPage.contactPage.buttonSend')}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </PageWrapper>
  );
};

export default ContactPage;
