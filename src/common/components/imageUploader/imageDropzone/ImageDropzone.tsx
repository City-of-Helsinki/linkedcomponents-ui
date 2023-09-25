import classNames from 'classnames';
import { IconDownload } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_FILE_NAME_LENGTH,
  MIN_IMAGE_HEIGHT,
  MIN_IMAGE_WIDTH,
  testIds,
} from '../../../../constants';
import { useNotificationsContext } from '../../../../domain/app/notificationsContext/hooks/useNotificationsContext';
import isTestEnv from '../../../../utils/isTestEnv';
import { getImageDimensions } from '../utils';
import styles from './imageDropzone.module.scss';

export interface ImageDropzoneProps {
  disabled?: boolean;
  onChange: (file: File) => void;
  title?: string;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  disabled,
  onChange,
  title,
}) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const fileInput = React.useRef<HTMLInputElement | null>(null);
  const [hovered, setHovered] = React.useState(false);

  const handleFile = async (file: File) => {
    if (!validateImageFileType(file)) {
      addNotification({
        label: t('common.imageUploader.notAllowedFileFormat'),
        type: 'error',
      });
      return;
    }

    if (!validateImageFileNameLength(file)) {
      addNotification({
        label: t('common.imageUploader.tooLongFileName', {
          maxLength: MAX_IMAGE_FILE_NAME_LENGTH,
        }),
        type: 'error',
      });
      return;
    }
    /* istanbul ignore next */
    if (!isTestEnv && !(await validateImageMinDimensions(file))) {
      addNotification({
        label: t('common.imageUploader.belowMinDimensions'),
        type: 'error',
      });
      return;
    }

    onChange(file);
  };

  const validateImageFileType = (file: File): boolean =>
    ACCEPTED_IMAGE_TYPES.includes(file.type);

  const validateImageFileNameLength = (file: File): boolean =>
    file.name.length <= MAX_IMAGE_FILE_NAME_LENGTH;

  /* istanbul ignore next */
  const validateImageMinDimensions = async (file: File): Promise<boolean> => {
    const { height, width } = await getImageDimensions(file);
    return height >= MIN_IMAGE_HEIGHT && width >= MIN_IMAGE_WIDTH;
  };

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
      event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInput.current?.click();
  };

  return (
    <div className={styles.imageDropzone}>
      <input
        data-testid={testIds.imageUploader.input}
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
export default ImageDropzone;
