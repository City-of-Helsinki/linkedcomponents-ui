import imageCompression from 'browser-image-compression';
import classNames from 'classnames';
import { IconDownload } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import {
  ACCEPTED_IMAGE_TYPES,
  COMPRESSABLE_IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_IMAGE_WIDTH,
} from '../../../constants';
import isTestEnv from '../../../utils/isTestEnv';
import styles from './imageUploader.module.scss';

export const testIds = {
  input: 'image-uploader-file-input',
};

export interface ImageUploaderProps {
  disabled?: boolean;
  onChange: (file: File) => void;
  title?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  disabled,
  onChange,
  title,
}) => {
  const { t } = useTranslation();
  const fileInput = React.useRef<HTMLInputElement | null>(null);
  const [hovered, setHovered] = React.useState(false);

  /* istanbul ignore next */
  const getCompressedFile = async (file: File) => {
    try {
      if (!isTestEnv && COMPRESSABLE_IMAGE_TYPES.includes(file.type)) {
        const blob = await imageCompression(file, {
          maxSizeMB: MAX_IMAGE_SIZE_MB,
          maxWidthOrHeight: MAX_IMAGE_WIDTH,
        });

        return new File([blob], file.name, { type: file.type });
      }
      return file;
    } catch (e) {
      return file;
    }
  };

  const handleFile = async (file: File) => {
    if (!validateImageFileType(file)) {
      toast.error(t('common.imageUploader.notAllowedFileFormat'));
      return;
    }

    const compressedFile = await getCompressedFile(file);

    if (!validateFileSize(compressedFile)) {
      toast.error(
        t('common.imageUploader.tooLargeFileSize', {
          maxSize: MAX_IMAGE_SIZE_MB,
        })
      );
    } else {
      onChange(compressedFile);
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

    if (disabled) return;

    //let's grab the image file
    const imageFile = event.dataTransfer.files[0];

    handleFile(imageFile);

    setHovered(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];

    /* istanbul ignore else */
    if (imageFile) {
      handleFile(imageFile);
    }
  };

  const handleClick = () => {
    fileInput.current?.click();
  };

  return (
    <div className={styles.imageUploader}>
      <input
        data-testid={testIds.input}
        disabled={disabled}
        ref={fileInput}
        type="file"
        onChange={handleChange}
        accept={'image/*'}
        hidden={true}
      />
      <button
        className={classNames(styles.dropZone, { [styles.hover]: hovered })}
        disabled={disabled}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        title={title}
      >
        <IconDownload aria-hidden={true} />
        {t('common.imageUploader.buttonDropImage')}
      </button>
    </div>
  );
};
export default ImageUploader;
