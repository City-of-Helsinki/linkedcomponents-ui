import { Field, Formik } from 'formik';
import { Button, Dialog, IconInfoCircle, IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextEditorField from '../../../../common/components/formFields/textEditorField/TextEditorField';
import TextInputField from '../../../../common/components/formFields/textInputField/TextInputField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import LoadingButton from '../../../../common/components/loadingButton/LoadingButton';
import { EnrolmentFieldsFragment } from '../../../../generated/graphql';
import { SEND_MESSAGE_FIELDS, SEND_MESSAGE_FORM_NAME } from '../../constants';
import { SendMessageFormFields } from '../../types';
import { sendMessageSchema } from '../../validation';

export interface SendMessageModalProps {
  enrolment?: EnrolmentFieldsFragment;
  focusAfterCloseElement?: HTMLElement;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSendMessage: (input: SendMessageFormFields, signups?: string[]) => void;
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({
  enrolment,
  focusAfterCloseElement,
  isOpen,
  isSaving,
  onClose,
  onSendMessage,
}) => {
  const { t } = useTranslation();

  const submitSendMessage = (values: SendMessageFormFields) => {
    onSendMessage(values, enrolment ? [enrolment.id] : undefined);
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
          enrolment
            ? t('enrolment.sendMessageModal.titleSingle')
            : t('enrolment.sendMessageModal.title')
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
        {({ handleSubmit }) => {
          return (
            <>
              <Dialog.Content>
                <FormGroup>
                  <Field
                    component={TextInputField}
                    label={t(`enrolment.sendMessageModal.labelSubject`)}
                    name={`${SEND_MESSAGE_FORM_NAME}.${SEND_MESSAGE_FIELDS.SUBJECT}`}
                    placeholder={t(
                      `enrolment.sendMessageModal.placeholderSubject`
                    )}
                    required={true}
                  />
                </FormGroup>
                <FormGroup>
                  <Field
                    component={TextEditorField}
                    label={t(`enrolment.sendMessageModal.labelBody`)}
                    name={`${SEND_MESSAGE_FORM_NAME}.${SEND_MESSAGE_FIELDS.BODY}`}
                    placeholder={t(
                      `enrolment.sendMessageModal.placeholderBody`
                    )}
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
                  {t('enrolment.sendMessageModal.buttonSendMessage')}
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
