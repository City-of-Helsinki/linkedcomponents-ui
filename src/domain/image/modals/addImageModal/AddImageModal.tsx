import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../../../../common/components/modal/Modal';
import AddImageForm from '../../addImageForm/AddImageForm';
import { AddImageSettings } from '../../types';

interface AddImageModalProps {
  isOpen: boolean;
  onAddImage: (values: AddImageSettings) => void;
  onClose: () => void;
  onFileChange: (image: File) => void;
  publisher: string;
  showImageSelector?: boolean;
}

const AddImageModal: React.FC<AddImageModalProps> = ({
  isOpen,
  onAddImage,
  onClose,
  onFileChange,
  publisher,
  showImageSelector,
}) => {
  const { t } = useTranslation();

  return isOpen ? (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldCloseOnEsc={false}
      title={t(`image.modalTitleAddImage`)}
    >
      <AddImageForm
        onCancel={onClose}
        onFileChange={onFileChange}
        onSubmit={onAddImage}
        publisher={publisher}
        showImageSelector={showImageSelector}
      />
    </Modal>
  ) : null;
};

export default AddImageModal;
