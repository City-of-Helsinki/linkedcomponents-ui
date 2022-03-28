import { Dialog, IconAlertCircle } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import styles from '../../../common/components/dialog/dialog.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { ORGANIZATION_ACTION_ICONS, ORGANIZATION_ACTIONS } from '../constants';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
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

  const id = 'confirm-organization-delete-modal';
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
        title={t('organization.deleteOrganizationModal.title')}
      />
      <Dialog.Content>
        <p className={styles.warning}>
          <strong>{t('common.warning')}</strong>
        </p>
        <p id={descriptionId}>
          {t('organization.deleteOrganizationModal.text')}{' '}
        </p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <LoadingButton
          disabled={isSaving}
          icon={ORGANIZATION_ACTION_ICONS[ORGANIZATION_ACTIONS.DELETE]}
          loading={isSaving}
          onClick={handleDelete}
          type="button"
          variant="danger"
        >
          {t('organization.deleteOrganizationModal.buttonDelete')}
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