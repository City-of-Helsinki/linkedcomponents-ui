import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { ValidationError } from 'yup';

import CheckboxField from '../../../common/components/formFields/CheckboxField';
import PublisherSelectorField from '../../../common/components/formFields/PublisherSelectorField';
import SingleKeywordSelectorField from '../../../common/components/formFields/SingleKeywordSelectorField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import {
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
  ROUTES,
} from '../../../constants';
import {
  CreateKeywordMutationInput,
  KeywordFieldsFragment,
  useCreateKeywordMutation,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import { showFormErrors } from '../../../utils/validationUtils';
import Container from '../../app/layout/Container';
import { reportError } from '../../app/sentry/utils';
import { clearKeywordsQueries } from '../../keywords/utils';
import useUser from '../../user/hooks/useUser';
import {
  KEYWORD_ACTIONS,
  KEYWORD_FIELDS,
  KEYWORD_INITIAL_VALUES,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import useKeywordServerErrors from '../hooks/useKeywordServerErrors';
import KeywordAuthenticationNotification from '../keywordAuthenticationNotification/KeywordAuthenticationNotification';
import { KeywordFormFields } from '../types';
import { getKeywordPayload } from '../utils';
import { keywordSchema, scrollToFirstError } from '../validation';
import FormRow from './FormRow';
import styles from './keywordForm.module.scss';

type KeywordFormProps = {
  keyword?: KeywordFieldsFragment;
};

const KeywordForm: React.FC<KeywordFormProps> = ({ keyword }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const history = useHistory();
  const location = useLocation();
  const { user } = useUser();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [saving, setSaving] = React.useState(false);

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useKeywordServerErrors();

  const [createKeywordMutation] = useCreateKeywordMutation();

  const goToKeywordsPage = () => {
    history.push(`/${locale}${ROUTES.KEYWORDS}`);
  };

  const createSingleKeyword = async (payload: CreateKeywordMutationInput) => {
    try {
      const data = await createKeywordMutation({
        variables: { input: payload },
      });

      return data.data?.createKeyword.id as string;
    } catch (error) /* istanbul ignore next */ {
      showServerErrors({ error });
      // // Report error to Sentry
      reportError({
        data: {
          error: error as Record<string, unknown>,
          payload,
          payloadAsString: JSON.stringify(payload),
        },
        location,
        message: 'Failed to create keyword',
        user,
      });
    }
  };

  const createKeyword = async (values: KeywordFormFields) => {
    setSaving(true);
    const payload = getKeywordPayload(values);

    const createdKeywordId = await createSingleKeyword(payload);

    if (createdKeywordId) {
      // Clear all keywords queries from apollo cache to show added registrations
      // in registration list
      clearKeywordsQueries(apolloClient);
      goToKeywordsPage();
    }

    setSaving(false);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={KEYWORD_INITIAL_VALUES}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={/* istanbul ignore next */ () => undefined}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={keywordSchema}
    >
      {({ setErrors, setTouched, values }) => {
        const clearErrors = () => setErrors({});

        const handleCreate = async (
          event?: React.FormEvent<HTMLFormElement>
        ) => {
          event?.preventDefault();

          try {
            setServerErrorItems([]);
            clearErrors();

            await keywordSchema.validate(values, { abortEarly: false });

            await createKeyword(values);
          } catch (error) {
            showFormErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });

            scrollToFirstError({ error: error as ValidationError });
          }
        };

        return (
          <Form className={styles.form} noValidate={true}>
            <Container className={styles.form} withOffset>
              <KeywordAuthenticationNotification
                action={
                  keyword ? KEYWORD_ACTIONS.UPDATE : KEYWORD_ACTIONS.CREATE
                }
                publisher={values.publisher}
              />
              <ServerErrorSummary errors={serverErrorItems} />

              <FormRow className={styles.borderInMobile}>
                <Field
                  className={styles.alignedInputWithFullBorder}
                  component={TextInputField}
                  label={t(`keyword.form.labelId`)}
                  name={KEYWORD_FIELDS.ID}
                  readOnly
                />
              </FormRow>

              <FormRow className={styles.borderInMobile}>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  label={t(`keyword.form.labelDataSource`)}
                  name={KEYWORD_FIELDS.DATA_SOURCE}
                  readOnly
                />
              </FormRow>

              <FormRow>
                <Field
                  className={styles.alignedInput}
                  component={TextInputField}
                  label={t(`keyword.form.labelOriginId`)}
                  name={KEYWORD_FIELDS.ORIGIN_ID}
                />
              </FormRow>

              <FormRow>
                <Field
                  className={styles.alignedSelect}
                  clearable
                  component={PublisherSelectorField}
                  label={t(`keyword.form.labelPublisher`)}
                  name={KEYWORD_FIELDS.PUBLISHER}
                />
              </FormRow>

              {ORDERED_LE_DATA_LANGUAGES.map((language) => {
                const langText = lowerCaseFirstLetter(
                  t(`form.inLanguage.${language}`)
                );

                return (
                  <FormRow key={language}>
                    <Field
                      className={styles.alignedInput}
                      component={TextInputField}
                      label={`${t('keyword.form.labelName')} (${langText})`}
                      name={`${KEYWORD_FIELDS.NAME}.${language}`}
                      required={language === LE_DATA_LANGUAGES.FI}
                    />
                  </FormRow>
                );
              })}

              <FormRow>
                <Field
                  className={styles.alignedSelect}
                  clearable
                  component={SingleKeywordSelectorField}
                  label={t(`keyword.form.labelReplacedBy`)}
                  name={KEYWORD_FIELDS.REPLACED_BY}
                />
              </FormRow>

              <FormRow>
                <Field
                  label={t(`keyword.form.labelDeprecated`)}
                  name={KEYWORD_FIELDS.DEPRECATED}
                  component={CheckboxField}
                />
              </FormRow>
            </Container>
            {!keyword && (
              <CreateButtonPanel
                onSave={handleCreate}
                publisher={values.publisher}
                saving={saving}
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default KeywordForm;
