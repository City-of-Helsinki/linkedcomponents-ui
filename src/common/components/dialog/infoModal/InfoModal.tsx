import { Dialog, IconInfoCircle } from 'hds-react';
import React from 'react';

import Button from '../../button/Button';
import styles from '../dialog.module.scss';

export type CommonInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type InfoModalProps = {
  closeButtonText: string;
  description: string;
  heading: string;
  id: string;
} & CommonInfoModalProps;

const InfoModal: React.FC<InfoModalProps> = ({
  closeButtonText,
  description,
  heading,
  id,
  isOpen,
  onClose,
}) => {
  const handleClose = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    onClose();
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
      variant="primary"
    >
      <Dialog.Header
        id={titleId}
        iconLeft={<IconInfoCircle aria-hidden={true} />}
        title={heading}
      />
      <Dialog.Content>
        <p id={descriptionId}>{description}</p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button onClick={handleClose} type="button" variant="primary">
          {closeButtonText}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default InfoModal;
