import classNames from 'classnames';
import { IconDownload } from 'hds-react';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '../../../constants';
import styles from './imageUploader.module.scss';

const generateUniqueId = (prefix: string) => `${prefix}-${uniqueId()}`;

export const testIds = {
  input: 'image-uploader-file-input',
  label: 'image-uploader-file-label',
};

export interface ImageUploaderProps {
  onChange: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange }) => {
  const { t } = useTranslation();
  const fileInput = React.useRef<HTMLInputElement | null>(null);
  const fileInputId = React.useMemo(
    () => generateUniqueId('image-uploader-file-input'),
    []
  );
  const [hovered, setHovered] = React.useState(false);

  const handleFile = (file: File) => {
    if (!validateImageFileType(file)) {
      toast.error(t('common.imageUploader.notAllowedFileFormat'));
    } else if (!validateFileSize(file)) {
      toast.error(
        t('common.imageUploader.tooLargeFileSize', {
          maxSize: MAX_IMAGE_SIZE_MB,
        })
      );
    } else {
      onChange(file);
    }
  };

  const validateImageFileType = (file: File): boolean => {
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  };

  const validateFileSize = (file: File): boolean => {
    const decimalFactor = 1000 * 1000;
    const fileSizeInMB = file.size / decimalFactor;

    return fileSizeInMB <= MAX_IMAGE_SIZE_MB;
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setHovered(true);
  };

  const handleDragLeave = () => {
    setHovered(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    //prevent the browser from opening the image
    event.preventDefault();
    event.stopPropagation();
    //let's grab the image file
    const imageFile = event.dataTransfer.files[0];

    handleFile(imageFile);

    setHovered(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];

    if (imageFile) {
      handleFile(imageFile);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fileInput.current?.click();
    }
  };

  return (
    <div className={styles.imageUploader}>
      <label
        data-testid={testIds.label}
        htmlFor={fileInputId}
        className={classNames(styles.dropZone, { [styles.hover]: hovered })}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <p>
          <IconDownload />
          {t('common.imageUploader.buttonDropImage')}
        </p>
      </label>
      <input
        data-testid={testIds.input}
        id={fileInputId}
        ref={fileInput}
        type="file"
        onChange={handleChange}
        accept={'image/*'}
        hidden={true}
      />
    </div>
  );
};
export default ImageUploader;
