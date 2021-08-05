import { Field, Form, Formik, FormikHelpers } from 'formik';
import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { scroller } from 'react-scroll';

import Button from '../../../common/components/button/Button';
import SingleSelectField from '../../../common/components/formFields/SingleSelectField';
import TextAreaField from '../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import FormGroup from '../../../common/components/formGroup/FormGroup';
import Notification from '../../../common/components/notification/Notification';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import {
  usePostFeedbackMutation,
  usePostGuestFeedbackMutation,
} from '../../../generated/graphql';
import MainContent from '../../app/layout/MainContent';
import PageWrapper from '../../app/layout/PageWrapper';
import { authenticatedSelector, userSelector } from '../../auth/selectors';
import useFeedbackServerErrors from '../../feedback/hooks/useFeedbackServerErrors';
import {
  CONTACT_FORM_BODY_MAX_LENGTH,
  CONTACT_FORM_FIELD,
  CONTACT_TOPICS,
  contactFormSchema,
} from '../constants';
import AddingEventsFaq from '../faq/AddingEventsFaq';
import AddingToOwnProjectsFaq from '../faq/AddingToOwnProjectsFaq';
import EventFormNotWorkingFaq from '../faq/EventFormNotWorkingFaq';
import EventNotShownFaq from '../faq/EventNotShownFaq';
import ImageRightsFaq from '../faq/ImageRightsFaq';
import PublishingPermissionsFaq from '../faq/PublishingPermissionsFaq';
import { ContactFormFields } from '../types';
import { getInitialValues, scrollToFirstError, showErrors } from '../utils';
import styles from './contactPage.module.scss';

const ContactPage: React.FC = () => {
  const [successId] = React.useState(() => uniqueId('contact-form-success-'));
  const { t } = useTranslation();
  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useFeedbackServerErrors();
  const topicOptions = Object.values(CONTACT_TOPICS).map((topic) => ({
    label: t(`helpPage.contactPage.topics.${camelCase(topic)}`),
    value: topic,
  }));
  const authenticated = useSelector(authenticatedSelector);
  const user = useSelector(userSelector);
  const initialValues = React.useMemo(() => getInitialValues(user), [user]);

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

    const payload = {
      ...omit(values, ['body', 'topic']),
      body: `${
        topicOptions.find((topic) => topic.value === values.topic)?.label
      }:\n\n${values.body}`,
    };

    try {
      if (authenticated) {
        await postFeedback({ variables: { input: payload } });
      } else {
        await postGuestFeedback({ variables: { input: payload } });
      }

      resetForm();
      await validateForm();

      scroller.scrollTo(successId, {
        duration: 300,
        offset: -200,
        smooth: true,
      });
      setSuccess(true);

      document
        .getElementById(
          authenticated ? CONTACT_FORM_FIELD.SUBJECT : CONTACT_FORM_FIELD.NAME
        )
        ?.focus();
    } catch (error) /* istanbul ignore next */ {
      setSuccess(false);
      showServerErrors({ error });
    }
  };

  const getFaqItems = (topic: CONTACT_TOPICS) => {
    switch (topic) {
      case CONTACT_TOPICS.EVENT_FORM:
        return [
          <AddingEventsFaq />,
          <EventFormNotWorkingFaq />,
          <EventNotShownFaq />,
        ];
      case CONTACT_TOPICS.PERMISSIONS:
        return [
          <AddingToOwnProjectsFaq />,
          <PublishingPermissionsFaq />,
          <ImageRightsFaq />,
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
      <MainContent>
        <h1>{t('helpPage.contactPage.pageTitle')}</h1>

        <Formik
          initialValues={initialValues}
          onSubmit={submitContactForm}
          validationSchema={contactFormSchema}
          validateOnMount
          validateOnBlur
          validateOnChange
        >
          {({
            resetForm,
            setErrors,
            setTouched,
            validateForm,
            values: { topic, ...restValues },
          }) => {
            const clearErrors = () => {
              setErrors({});
            };

            const handleSubmit = async () => {
              const values = { topic, ...restValues };
              try {
                setSuccess(false);
                setServerErrorItems([]);
                clearErrors();

                await contactFormSchema.validate(values, {
                  abortEarly: false,
                });

                submitContactForm(values, { resetForm, validateForm });
              } catch (error) {
                showErrors({
                  error,
                  setErrors,
                  setTouched,
                });

                scrollToFirstError({ error });
              }
            };

            const faqItems = getFaqItems(topic as CONTACT_TOPICS);

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
                      {faqItems.map((item, index) =>
                        React.cloneElement(item, { key: index })
                      )}
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
                    maxLength={CONTACT_FORM_BODY_MAX_LENGTH}
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
      </MainContent>
    </PageWrapper>
  );
};

export default ContactPage;
