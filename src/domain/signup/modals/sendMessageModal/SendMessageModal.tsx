import { Field, Formik } from 'formik';
import { Button, Dialog, IconInfoCircle, IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { scroller } from 'react-scroll';
import { ValidationError } from 'yup';

import TextEditorField from '../../../../common/components/formFields/textEditorField/TextEditorField';
import TextInputField from '../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import LoadingButton from '../../../../common/components/loadingButton/LoadingButton';
import { VALIDATION_ERROR_SCROLLER_OPTIONS } from '../../../../constants';
import {
  SignupFieldsFragment,
  SignupGroupFieldsFragment,
} from '../../../../generated/graphql';
import getValue from '../../../../utils/getValue';
import { showFormErrors } from '../../../../utils/validationUtils';
import { sendMessageSchema } from '../../../signupGroup/validation';
import { SEND_MESSAGE_FIELDS, SEND_MESSAGE_FORM_NAME } from '../../constants';
import { SendMessageFormFields } from '../../types';

export interface SendMessageModalProps {
  focusAfterCloseElement?: HTMLElement;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSendMessage: (options: {
    signupGroups?: string[];
    signups?: string[];
    values: SendMessageFormFields;
  }) => Promise<void>;
  signup?: SignupFieldsFragment;
  signupGroup?: SignupGroupFieldsFragment;
}

const TEXT_EDITOR_FIELDS = [SEND_MESSAGE_FIELDS.BODY];

const isTextEditor = (fieldName: string): boolean =>
  Boolean(TEXT_EDITOR_FIELDS.find((item) => fieldName.endsWith(item)));

const getFocusableFieldId = (fieldName: string): string =>
  isTextEditor(fieldName) ? `${fieldName}-text-editor` : fieldName;

export const scrollToFirstError = async (
  error: ValidationError
): Promise<void> => {
  for (const e of error.inner) {
    const path = getValue(e.path, '');
    const fieldId = getFocusableFieldId(path);
    const field = document.getElementById(fieldId);

    /* istanbul ignore else */
    if (field) {
      scroller.scrollTo(fieldId, VALIDATION_ERROR_SCROLLER_OPTIONS);
      isTextEditor(path) ? field.click() : field.focus();
      break;
    }
  }
};

const SendMessageModal: React.FC<SendMessageModalProps> = ({
  focusAfterCloseElement,
  isOpen,
  isSaving,
  onClose,
  onSendMessage,
  signup,
  signupGroup,
}) => {
  const { t } = useTranslation();

  const submitSendMessage = (values: SendMessageFormFields) => {
    onSendMessage({
      signupGroups: signupGroup ? [signupGroup.id as string] : undefined,
      signups: signup ? [signup.id] : undefined,
      values,
    });
  };

  const id = 'send-message-modal';
  const titleId = `${id}-title`;

  if (!isOpen) return null;

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      focusAfterCloseElement={focusAfterCloseElement}
      isOpen={isOpen}
      variant="primary"
    >
      <Dialog.Header
        id={titleId}
        iconLeft={<IconInfoCircle aria-hidden={true} />}
        title={
          signup || signupGroup
            ? t('signup.sendMessageModal.titleSingle')
            : t('signup.sendMessageModal.title')
        }
      />
      <Formik
        initialValues={{
          [SEND_MESSAGE_FORM_NAME]: {
            body: '',
            subject: '',
          },
        }}
        onSubmit={submitSendMessage}
        validateOnBlur={false}
        validateOnChange
        validateOnMount
        validationSchema={sendMessageSchema}
      >
        {({ setErrors, setTouched, values }) => {
          const handleSubmit = async () => {
            try {
              await sendMessageSchema.validate(values, {
                abortEarly: false,
              });
              submitSendMessage(values);
            } catch (error) {
              showFormErrors({
                error: error as ValidationError,
                setErrors,
                setTouched,
              });

              await scrollToFirstError(error as ValidationError);
            }
          };
          return (
            <>
              <Dialog.Content>
                <FormGroup>
                  <Field
                    component={TextInputField}
                    label={t(`signup.sendMessageModal.labelSubject`)}
                    name={`${SEND_MESSAGE_FORM_NAME}.${SEND_MESSAGE_FIELDS.SUBJECT}`}
                    placeholder={t(
                      `signup.sendMessageModal.placeholderSubject`
                    )}
                    required={true}
                  />
                </FormGroup>
                <FormGroup>
                  <Field
                    component={TextEditorField}
                    label={t(`signup.sendMessageModal.labelBody`)}
                    name={`${SEND_MESSAGE_FORM_NAME}.${SEND_MESSAGE_FIELDS.BODY}`}
                    placeholder={t(`signup.sendMessageModal.placeholderBody`)}
                    required={true}
                  />
                </FormGroup>
              </Dialog.Content>
              <Dialog.ActionButtons>
                <LoadingButton
                  loading={isSaving}
                  onClick={() => handleSubmit()}
                  icon={<IconPen />}
                  type="button"
                  variant="primary"
                >
                  {t('signup.sendMessageModal.buttonSendMessage')}
                </LoadingButton>
                <Button onClick={onClose} type="button" variant="secondary">
                  {t('common.cancel')}
                </Button>
              </Dialog.ActionButtons>
            </>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default SendMessageModal;
