/* eslint-disable max-len */
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ValidationError } from 'yup';

import Button from '../../../../common/components/button/Button';
import SingleOrganizationSelectorField from '../../../../common/components/formFields/singleOrganizationSelectorField/SingleOrganizationSelectorField';
import TextAreaField from '../../../../common/components/formFields/textAreaField/TextAreaField';
import TextInputField from '../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import Notification from '../../../../common/components/notification/Notification';
import ServerErrorSummary from '../../../../common/components/serverErrorSummary/ServerErrorSummary';
import { FeedbackInput } from '../../../../generated/graphql';
import useIdWithPrefix from '../../../../hooks/useIdWithPrefix';
import useLocale from '../../../../hooks/useLocale';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../../utils/validationUtils';
import AuthenticationNotification from '../../../app/authenticationNotification/AuthenticationNotification';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import { useAuth } from '../../../auth/hooks/useAuth';
import useFeedbackServerErrors from '../../../feedback/hooks/useFeedbackServerErrors';
import useAllOrganizations from '../../../organization/hooks/useAllOrganizations';
import { getOrganizationFields } from '../../../organization/utils';
import {
  ASK_PERMISSION_FORM_FIELD,
  CONTACT_FORM_BODY_MAX_LENGTH,
} from '../../constants';
import useFeedbackActions from '../../hooks/useFeedbackActions';
import { AskPermissionFormFields } from '../../types';
import {
  getAskPermissionFormFocusableFieldId,
  getAskPermissionFormInitialValues,
} from '../../utils';
import { askPermissionFormSchema } from '../../validation';
import styles from '../contactPage.module.scss';

const AskPermissionPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useFeedbackServerErrors();

  const { organizations } = useAllOrganizations();
  const { isAuthenticated: authenticated, user } = useAuth();

  const initialValues = React.useMemo(
    () => getAskPermissionFormInitialValues(user),
    [user]
  );

  const successId = useIdWithPrefix({ prefix: 'ask-permission-form-success-' });

  const { setSuccess, submitFeedback, success } = useFeedbackActions({
    successId,
  });

  const getPayloadStart = (values: AskPermissionFormFields) => {
    const organization = organizations.find(
      (organization) => organization.atId === values.organization
    );

    if (organization) {
      const { id, name } = getOrganizationFields(organization, locale, t);

      return `${t(
        'helpPage.askPermissionPage.labelOrganization'
      )}: ${name}\nID: ${id}\n${t(
        'helpPage.askPermissionPage.labelJobDescription'
      )}: ${values.jobDescription}\n\n`;
    }

    return '';
  };

  const submitAskPermissionForm = async (
    values: AskPermissionFormFields,
    formikHelpers: Pick<
      FormikHelpers<AskPermissionFormFields>,
      'resetForm' | 'validateForm'
    >
  ) => {
    const { email, name } = values;
    const payload: FeedbackInput = {
      email,
      name,
      subject: t('helpPage.askPermissionPage.topics.access'),
      body: `${getPayloadStart(values)}${values.body}`,
    };

    submitFeedback(payload, {
      onError: (error) => {
        showServerErrors({ error });
      },
      onSuccess: async () => {
        const { resetForm, validateForm } = formikHelpers;

        resetForm();
        await validateForm();

        document
          .getElementById(
            getAskPermissionFormFocusableFieldId(
              ASK_PERMISSION_FORM_FIELD.ORGANIZATION
            )
          )
          ?.focus();
      },
    });
  };

  return (
    <PageWrapper title="helpPage.askPermissionPage.pageTitle">
      <h1>{t('helpPage.askPermissionPage.pageTitle')}</h1>
      <AuthenticationNotification
        className={styles.authenticationNotification}
        showOnlyNotAuthenticatedError
      />

      <Formik
        initialValues={initialValues}
        onSubmit={/* istanbul ignore next */ () => undefined}
        validationSchema={askPermissionFormSchema}
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

              await askPermissionFormSchema.validate(values, {
                abortEarly: false,
              });

              submitAskPermissionForm(values, { resetForm, validateForm });
            } catch (error) {
              showFormErrors({
                error: error as ValidationError,
                setErrors,
                setTouched,
              });

              scrollToFirstError({
                error: error as ValidationError,
                getFocusableFieldId: getAskPermissionFormFocusableFieldId,
              });
            }
          };

          return (
            <Form className={styles.contactForm} noValidate>
              <div id={successId}>
                {success && (
                  <Notification
                    label={t('helpPage.askPermissionPage.titleSuccess')}
                    type="success"
                  >
                    {t('helpPage.askPermissionPage.textSuccess')}
                  </Notification>
                )}
              </div>
              <ServerErrorSummary errors={serverErrorItems} />
              <h2>{t('helpPage.askPermissionPage.titleContactInfo')}</h2>
              <FormGroup>
                <Field
                  component={TextInputField}
                  disabled={!authenticated || user?.profile.name}
                  label={t('helpPage.askPermissionPage.labelName')}
                  name={ASK_PERMISSION_FORM_FIELD.NAME}
                  placeholder={t('helpPage.askPermissionPage.placeholderName')}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Field
                  component={TextInputField}
                  disabled={!authenticated || user?.profile.email}
                  label={t('helpPage.askPermissionPage.labelEmail')}
                  name={ASK_PERMISSION_FORM_FIELD.EMAIL}
                  placeholder={t('helpPage.askPermissionPage.placeholderEmail')}
                  required
                />
              </FormGroup>
              <h2>{t('helpPage.askPermissionPage.titleOrganization')}</h2>
              <FormGroup>
                <Field
                  component={SingleOrganizationSelectorField}
                  disabled={!authenticated}
                  label={t('helpPage.askPermissionPage.labelOrganization')}
                  name={ASK_PERMISSION_FORM_FIELD.ORGANIZATION}
                  placeholder={t(
                    'helpPage.askPermissionPage.placeholderOrganization'
                  )}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Field
                  component={TextInputField}
                  disabled={!authenticated}
                  label={t('helpPage.askPermissionPage.labelJobDescription')}
                  name={ASK_PERMISSION_FORM_FIELD.JOB_DESCRIPTION}
                  placeholder={t(
                    'helpPage.askPermissionPage.placeholderJobDescription'
                  )}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Field
                  component={TextAreaField}
                  disabled={!authenticated}
                  label={t('helpPage.contactPage.labelBody')}
                  maxLength={
                    CONTACT_FORM_BODY_MAX_LENGTH -
                    getPayloadStart(values).length
                  }
                  name={ASK_PERMISSION_FORM_FIELD.BODY}
                  placeholder={t('helpPage.askPermissionPage.placeholderBody')}
                  required
                />
              </FormGroup>

              <Button
                disabled={!authenticated}
                onClick={handleSubmit}
                fullWidth
              >
                {t('helpPage.askPermissionPage.buttonSend')}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </PageWrapper>
  );
};

export default AskPermissionPage;
