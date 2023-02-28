import { Dialog, IconAlertCircle } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import LoadingButton from '../..//loadingButton/LoadingButton';
import Button from '../../button/Button';
import styles from '../dialog.module.scss';

export type CommonConfirmDeleteModalProps = {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export type ConfirmDeleteModalProps = {
  bodyContent?: React.ReactElement;
  deleteButtonIcon: React.ReactElement;
  deleteButtonText: string;
  description: string;
  heading: string;
  id: string;
} & CommonConfirmDeleteModalProps;

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  bodyContent,
  deleteButtonIcon,
  deleteButtonText,
  description,
  heading,
  id,
  isOpen,
  isSaving,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation();

  const handleClose = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    onClose();
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    onDelete();
  };

  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={styles.dialog}
      isOpen={isOpen}
      variant="danger"
    >
      <Dialog.Header
        id={titleId}
        iconLeft={<IconAlertCircle aria-hidden={true} />}
        title={heading}
      />
      <Dialog.Content>
        <p className={styles.warning}>
          <strong>{t('common.warning')}</strong>
        </p>
        <p id={descriptionId}>{description} </p>
        {bodyContent}
      </Dialog.Content>
      <Dialog.ActionButtons>
        <LoadingButton
          disabled={isSaving}
          icon={deleteButtonIcon}
          loading={isSaving}
          onClick={handleDelete}
          type="button"
          variant="danger"
        >
          {deleteButtonText}
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

export default ConfirmDeleteModal;
