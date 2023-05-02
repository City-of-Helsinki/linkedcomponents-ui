import { Field, Form, Formik, FormikHelpers } from 'formik';
import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ValidationError } from 'yup';

import Button from '../../../../common/components/button/Button';
import SingleSelectField from '../../../../common/components/formFields/singleSelectField/SingleSelectField';
import TextAreaField from '../../../../common/components/formFields/textAreaField/TextAreaField';
import TextInputField from '../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import ServerErrorSummary from '../../../../common/components/serverErrorSummary/ServerErrorSummary';
import { FeedbackInput } from '../../../../generated/graphql';
import useIdWithPrefix from '../../../../hooks/useIdWithPrefix';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../../utils/validationUtils';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import { useAuth } from '../../../auth/hooks/useAuth';
import useFeedbackServerErrors from '../../../feedback/hooks/useFeedbackServerErrors';
import {
  CONTACT_FORM_BODY_MAX_LENGTH,
  CONTACT_FORM_FIELD,
  CONTACT_TOPICS,
} from '../../constants';
import AddingEventsFaq from '../../faq/addingEventsFaq/AddingEventsFaq';
import AddingToOwnProjectsFaq from '../../faq/addingToOwnProjectsFaq/AddingToOwnProjectsFaq';
import EventFormNotWorkingFaq from '../../faq/eventFormNotWorkingFaq/EventFormNotWorkingFaq';
import EventNotShownFaq from '../../faq/eventNotShownFaq/EventNotShownFaq';
import ImageRightsFaq from '../../faq/imageRightsFaq/ImageRightsFaq';
import PublishingPermissionsFaq from '../../faq/publishingPermissionsFaq/PublishingPermissionsFaq';
import useFeedbackActions from '../../hooks/useFeedbackActions';
import { ContactFormFields } from '../../types';
import {
  getContactFormFocusableFieldId,
  getContactFormInitialValues,
} from '../../utils';
import { contactFormSchema } from '../../validation';
import styles from '../contactPage.module.scss';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useFeedbackServerErrors();

  const { isAuthenticated: authenticated, user } = useAuth();
  const initialValues = React.useMemo(
    () => getContactFormInitialValues(user),
    [user]
  );

  const successId = useIdWithPrefix({ prefix: 'contact-form-success-' });
  const topicOptions = Object.values(CONTACT_TOPICS).map((topic) => ({
    label: t(`helpPage.contactPage.topics.${camelCase(topic)}`),
    value: topic,
  }));

  const { setSuccess, submitFeedback, success } = useFeedbackActions({
    successId,
  });

  const getPayloadStart = (values: ContactFormFields) => {
    const option = topicOptions.find((topic) => topic.value === values.topic);

    return `${option?.label}:\n\n`;
  };

  const submitContactForm = async (
    values: ContactFormFields,
    formikHelpers: Pick<
      FormikHelpers<ContactFormFields>,
      'resetForm' | 'validateForm'
    >
  ) => {
    const { email, name, subject } = values;

    const payload: FeedbackInput = {
      email,
      name,
      subject,
      body: `${getPayloadStart(values)}${values.body}`,
    };

    submitFeedback(payload, {
      onError: (error) => showServerErrors({ error }),
      onSuccess: async () => {
        const { resetForm, validateForm } = formikHelpers;

        resetForm();
        await validateForm();

        document
          .getElementById(
            getContactFormFocusableFieldId(
              authenticated ? CONTACT_FORM_FIELD.TOPIC : CONTACT_FORM_FIELD.NAME
            )
          )
          ?.focus();
      },
    });
  };

  const getFaqItems = (topic: CONTACT_TOPICS) => {
    switch (topic) {
      case CONTACT_TOPICS.EVENT_FORM:
        return [
          <AddingEventsFaq key="adding-events-faq" />,
          <EventFormNotWorkingFaq key="event-form-not-working-faq" />,
          <EventNotShownFaq key="event-not-shown-faq" />,
        ];
      case CONTACT_TOPICS.PERMISSIONS:
        return [
          <AddingToOwnProjectsFaq key="adding-to-own-project-faq" />,
          <PublishingPermissionsFaq key="publishing-permissions-faq" />,
          <ImageRightsFaq key="image-rights-faq" />,
        ];
      case CONTACT_TOPICS.FEATURE_REQUEST:
      case CONTACT_TOPICS.GENERAL:
      case CONTACT_TOPICS.OTHER:
      default:
        return [];
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
        onSubmit={/* istanbul ignore next */ () => undefined}
        validationSchema={contactFormSchema}
        validateOnMount
        validateOnBlur
        validateOnChange
      >
        {({ resetForm, setErrors, setTouched, validateForm, values }) => {
          const clearErrors = () => setErrors({});

          const handleSubmit = async () => {
            try {
              setSuccess(false);
              setServerErrorItems([]);
              clearErrors();

              await contactFormSchema.validate(values, { abortEarly: false });

              submitContactForm(values, { resetForm, validateForm });
            } catch (error) {
              showFormErrors({
                error: error as ValidationError,
                setErrors,
                setTouched,
              });

              scrollToFirstError({
                error: error as ValidationError,
                getFocusableFieldId: getContactFormFocusableFieldId,
              });
            }
          };

          const faqItems = getFaqItems(values.topic as CONTACT_TOPICS);

          return (
            <Form className={styles.contactForm} noValidate>
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
              <ServerErrorSummary errors={serverErrorItems} />
              <h2>{t('helpPage.contactPage.titleContactInfo')}</h2>
              <FormGroup>
                <Field
                  component={TextInputField}
                  disabled={authenticated && user?.profile.name}
                  label={t('helpPage.contactPage.labelName')}
                  name={CONTACT_FORM_FIELD.NAME}
                  placeholder={t('helpPage.contactPage.placeholderName')}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Field
                  component={TextInputField}
                  disabled={authenticated && user?.profile.email}
                  label={t('helpPage.contactPage.labelEmail')}
                  name={CONTACT_FORM_FIELD.EMAIL}
                  placeholder={t('helpPage.contactPage.placeholderEmail')}
                  required
                />
              </FormGroup>
              <h2>{t('helpPage.contactPage.titleMessage')}</h2>
              <FormGroup>
                <Field
                  component={SingleSelectField}
                  label={t('helpPage.contactPage.labelTopic')}
                  name={CONTACT_FORM_FIELD.TOPIC}
                  options={topicOptions}
                  placeholder={t('helpPage.contactPage.placeholderTopic')}
                  required
                />
              </FormGroup>
              {!!faqItems.length && (
                <>
                  <h3>{t('helpPage.contactPage.titleSuggestedTopics')}</h3>
                  <div className={styles.accordions}>
                    {faqItems.map((item) => React.cloneElement(item))}
                  </div>
                </>
              )}

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
                  maxLength={
                    CONTACT_FORM_BODY_MAX_LENGTH -
                    getPayloadStart(values).length
                  }
                  name={CONTACT_FORM_FIELD.BODY}
                  placeholder={t('helpPage.contactPage.placeholderBody')}
                  required
                />
              </FormGroup>

              <Button onClick={() => handleSubmit()} fullWidth>
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
