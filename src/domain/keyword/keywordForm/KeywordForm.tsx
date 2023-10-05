/* eslint-disable max-len */
import { ServerError } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import CheckboxField from '../../../common/components/formFields/checkboxField/CheckboxField';
import PublisherSelectorField from '../../../common/components/formFields/publisherSelectorField/PublisherSelectorField';
import SingleKeywordSelectorField from '../../../common/components/formFields/singleKeywordSelectorField/SingleKeywordSelectorField';
import TextInputField from '../../../common/components/formFields/textInputField/TextInputField';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import {
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
  ROUTES,
} from '../../../constants';
import { KeywordFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../utils/validationUtils';
import styles from '../../admin/layout/form.module.scss';
import FormRow from '../../admin/layout/formRow/FormRow';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import {
  KEYWORD_ACTIONS,
  KEYWORD_FIELDS,
  KEYWORD_INITIAL_VALUES,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import useKeywordActions from '../hooks/useKeywordActions';
import useKeywordServerErrors from '../hooks/useKeywordServerErrors';
import KeywordAuthenticationNotification from '../keywordAuthenticationNotification/KeywordAuthenticationNotification';
import { KeywordFormFields } from '../types';
import { checkCanUserDoAction, getKeywordInitialValues } from '../utils';
import { keywordSchema } from '../validation';

type KeywordFormProps = {
  keyword?: KeywordFieldsFragment;
};

const KeywordForm: React.FC<KeywordFormProps> = ({ keyword }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const { user } = useUser();

  const action = keyword ? KEYWORD_ACTIONS.UPDATE : KEYWORD_ACTIONS.CREATE;
  const savedKeywordPublisher = getValue(keyword?.publisher, '');

  const { organizationAncestors } = useOrganizationAncestors(
    savedKeywordPublisher
  );

  const isEditingAllowed = checkCanUserDoAction({
    action,
    organizationAncestors,
    publisher: savedKeywordPublisher,
    user,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useKeywordServerErrors();

  const { createKeyword, saving, updateKeyword } = useKeywordActions({
    keyword,
  });

  const goToKeywordsPage = () => {
    navigate(`/${locale}${ROUTES.KEYWORDS}`);
  };

  const onCreate = async (values: KeywordFormFields) => {
    await createKeyword(values, {
      onError: (error: ServerError) => showServerErrors({ error }),
      onSuccess: goToKeywordsPage,
    });
  };

  const onUpdate = async (values: KeywordFormFields) => {
    await updateKeyword(values, {
      onError: (error: ServerError) => showServerErrors({ error }),
      onSuccess: goToKeywordsPage,
    });
  };

  const inputRowBorderStyle = useMemo(
    () => (isEditingAllowed ? '' : styles.borderInMobile),
    [isEditingAllowed]
  );

  const inputRowBorderStyleIfKeyword = useMemo(
    () => (!isEditingAllowed || keyword ? styles.borderInMobile : ''),
    [isEditingAllowed, keyword]
  );

  const alignedInputStyleIfKeyword = useMemo(
    () =>
      !isEditingAllowed || keyword
        ? styles.alignedInputWithFullBorder
        : styles.alignedInput,
    [isEditingAllowed, keyword]
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        keyword ? getKeywordInitialValues(keyword) : KEYWORD_INITIAL_VALUES
      }
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={/* istanbul ignore next */ () => undefined}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={isEditingAllowed && keywordSchema}
    >
      {({ setErrors, setTouched, values }) => {
        const clearErrors = () => setErrors({});

        const handleSubmit = async (
          event?: React.FormEvent<HTMLFormElement>
        ) => {
          event?.preventDefault();

          try {
            setServerErrorItems([]);
            clearErrors();

            await keywordSchema.validate(values, { abortEarly: false });

            if (keyword) {
              await onUpdate(values);
            } else {
              await onCreate(values);
            }
          } catch (error) {
            showFormErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });

            scrollToFirstError({ error: error as ValidationError });
          }
        };

        const publisher = keyword
          ? getValue(keyword.publisher, '')
          : values.publisher;

        const disabledIfKeyword = !isEditingAllowed || !!keyword;

        return (
          <Form noValidate={true}>
            <KeywordAuthenticationNotification
              action={action}
              publisher={publisher}
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
                className={alignedInputStyleIfKeyword}
                component={TextInputField}
                label={t(`keyword.form.labelDataSource`)}
                name={KEYWORD_FIELDS.DATA_SOURCE}
                readOnly
              />
            </FormRow>

            <FormRow className={inputRowBorderStyleIfKeyword}>
              <Field
                className={styles.alignedInput}
                component={TextInputField}
                label={t(`keyword.form.labelOriginId`)}
                name={KEYWORD_FIELDS.ORIGIN_ID}
                readOnly={disabledIfKeyword}
              />
            </FormRow>

            <FormRow>
              <Field
                alignedLabel
                className={styles.alignedSelect}
                clearable
                component={PublisherSelectorField}
                label={t(`keyword.form.labelPublisher`)}
                name={KEYWORD_FIELDS.PUBLISHER}
                disabled={disabledIfKeyword}
              />
            </FormRow>

            {ORDERED_LE_DATA_LANGUAGES.map((language, i) => {
              const langText = lowerCaseFirstLetter(
                t(`form.inLanguage.${language}`)
              );

              const isLastRow = ORDERED_LE_DATA_LANGUAGES.length - 1 === i;

              const inputStyle =
                !isEditingAllowed && !isLastRow
                  ? styles.alignedInputWithFullBorder
                  : styles.alignedInput;

              return (
                <FormRow key={language} className={inputRowBorderStyle}>
                  <Field
                    className={inputStyle}
                    component={TextInputField}
                    label={`${t('keyword.form.labelName')} (${langText})`}
                    name={`${KEYWORD_FIELDS.NAME}.${language}`}
                    readOnly={!isEditingAllowed}
                    required={language === LE_DATA_LANGUAGES.FI}
                  />
                </FormRow>
              );
            })}

            <FormRow>
              <Field
                alignedLabel
                className={styles.alignedSelect}
                clearable
                component={SingleKeywordSelectorField}
                disabled={!isEditingAllowed}
                label={t(`keyword.form.labelReplacedBy`)}
                name={KEYWORD_FIELDS.REPLACED_BY}
              />
            </FormRow>

            <FormRow>
              <Field
                component={CheckboxField}
                disabled={!isEditingAllowed}
                label={t(`keyword.form.labelDeprecated`)}
                name={KEYWORD_FIELDS.DEPRECATED}
              />
            </FormRow>
            {keyword ? (
              <EditButtonPanel
                id={values.id}
                onSave={handleSubmit}
                publisher={publisher}
                saving={saving}
              />
            ) : (
              <CreateButtonPanel
                onSave={handleSubmit}
                publisher={publisher}
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
