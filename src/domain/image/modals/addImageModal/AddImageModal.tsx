import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../../../../common/components/modal/Modal';
import AddImageForm from '../../addImageForm/AddImageForm';
import { AddImageSettings } from '../../types';

interface AddImageModalProps {
  isOpen: boolean;

  onAddImage: (values: AddImageSettings) => void;
  onAddImageByFile: (image: File) => void;
  onClose: () => void;

  publisher: string;
  showImageSelector?: boolean;
}

const AddImageModal: React.FC<AddImageModalProps> = ({
  isOpen,
  onAddImage,
  onAddImageByFile,
  onClose,
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
        onAddImageByFile={onAddImageByFile}
        onCancel={onClose}
        onSubmit={onAddImage}
        publisher={publisher}
        showImageSelector={showImageSelector}
      />
    </Modal>
  ) : null;
};

export default AddImageModal;
