import {
  Dialog,
  DialogVariant,
  IconAlertCircle,
  IconInfoCircle,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../button/Button';
import LoadingButton from '../../loadingButton/LoadingButton';
import styles from '../dialog.module.scss';

export type CommonConfirmModalProps = {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

type ConfirmModalProps = {
  bodyContent?: React.ReactElement;
  confirmButtonIcon: React.ReactElement;
  confirmButtonText: string;
  description: string;
  extraWarning?: React.ReactElement;
  heading: string;
  id: string;
  variant: DialogVariant;
} & CommonConfirmModalProps;

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  bodyContent,
  confirmButtonIcon,
  confirmButtonText,
  description,
  extraWarning,
  heading,
  id,
  isOpen,
  isSaving,
  onClose,
  onConfirm,
  variant,
}) => {
  const { t } = useTranslation();

  const handleClose = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    onClose();
  };

  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    onConfirm();
  };

  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  if (!isOpen) return null;

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={styles.dialog}
      isOpen={isOpen}
      variant={variant}
    >
      <Dialog.Header
        id={titleId}
        iconLeft={
          variant === 'primary' ? (
            <IconInfoCircle aria-hidden={true} />
          ) : (
            <IconAlertCircle aria-hidden={true} />
          )
        }
        title={heading}
      />
      <Dialog.Content>
        {extraWarning}
        {variant === 'danger' && (
          <p className={styles.warning}>
            <strong>{t('common.warning')}</strong>
          </p>
        )}
        <p id={descriptionId}>{description}</p>
        {bodyContent}
      </Dialog.Content>
      <Dialog.ActionButtons>
        <LoadingButton
          disabled={isSaving}
          icon={confirmButtonIcon}
          loading={isSaving}
          onClick={handleConfirm}
          type="button"
          variant={variant === 'danger' ? 'danger' : 'primary'}
        >
          {confirmButtonText}
        </LoadingButton>
        <Button
          disabled={isSaving}
          onClick={handleClose}
          theme="black"
          type="button"
          variant="secondary"
        >
          {t('common.cancel')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default ConfirmModal;
