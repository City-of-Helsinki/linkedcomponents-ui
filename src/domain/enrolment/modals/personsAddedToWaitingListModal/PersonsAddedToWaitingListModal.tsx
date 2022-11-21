import { Dialog, IconInfoCircle } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import styles from '../../../../common/components/dialog/dialog.module.scss';

export interface PersonsAddedToWaitingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PersonsAddedToWaitingListModal: React.FC<
  PersonsAddedToWaitingListModalProps
> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const handleClose = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    onClose();
  };

  const id = 'persons-added-to-waiting-list-modal';
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={styles.dialog}
      isOpen={isOpen}
      variant="primary"
    >
      <Dialog.Header
        id={titleId}
        iconLeft={<IconInfoCircle aria-hidden={true} />}
        title={t('enrolment.personsAddedToWaitingListModal.title')}
      />
      <Dialog.Content>
        <p id={descriptionId}>
          {t('enrolment.personsAddedToWaitingListModal.text')}
        </p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button onClick={handleClose} type="button" variant="primary">
          {t('enrolment.personsAddedToWaitingListModal.buttonClose')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default PersonsAddedToWaitingListModal;
