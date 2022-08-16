import classNames from 'classnames';
import { IconDownload } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { ACCEPTED_IMAGE_TYPES } from '../../../../constants';
import { testIds } from '../ImageUploader';
import styles from './imageDropzone.module.scss';

export interface ImageDropzoneProps {
  disabled?: boolean;
  onChange: (file: File) => void;
  title?: string;
}

const ImageUploader: React.FC<ImageDropzoneProps> = ({
  disabled,
  onChange,
  title,
}) => {
  const { t } = useTranslation();
  const fileInput = React.useRef<HTMLInputElement | null>(null);
  const [hovered, setHovered] = React.useState(false);

  const handleFile = async (file: File) => {
    if (!validateImageFileType(file)) {
      toast.error(t('common.imageUploader.notAllowedFileFormat'));
      return;
    }

    onChange(file);
  };

  const validateImageFileType = (file: File): boolean =>
    ACCEPTED_IMAGE_TYPES.includes(file.type);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    /* istanbul ignore else */
    if (!disabled) {
      setHovered(true);
    }
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
    <div className={styles.imageDropzone}>
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
        type="button"
        title={title}
      >
        <IconDownload aria-hidden={true} />
        {t('common.imageUploader.buttonDropImage')}
      </button>
    </div>
  );
};
export default ImageUploader;
