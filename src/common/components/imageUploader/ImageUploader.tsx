import { IconMinusCircle } from 'hds-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PixelCrop } from 'react-image-crop';

import isTestEnv from '../../../utils/isTestEnv';
import Button from '../button/Button';
import { TEST_PIXEL_CROP } from './contants';
import ImageCropper from './imageCropper/ImageCropper';
import ImageDropzone from './imageDropzone/ImageDropzone';
import styles from './imageUploader.module.scss';
import { getFileDataUrl } from './utils';

export interface ImageUploaderProps {
  disabled?: boolean;
  onChange: (
    file: File | null,
    crop: PixelCrop | null,
    imageEl: HTMLImageElement | null
  ) => void;
  title?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  disabled,
  onChange,
  title,
}) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File>();
  const [imgSrc, setImgSrc] = useState<string>();

  const handleChangeFile = async (file: File) => {
    setFile(file);
    setImgSrc(await getFileDataUrl(file));

    // istanbul ignore else
    if (isTestEnv) {
      onChange(file, TEST_PIXEL_CROP, null);
    }
  };

  const removeImageFile = () => {
    setFile(undefined);
    setImgSrc(undefined);
    onChange(null, null, null);
  };

  // istanbul ignore next
  const handleChangeCrop = (crop: PixelCrop, imageEl: HTMLImageElement) => {
    onChange(file as File, crop, imageEl);
  };

  return (
    <>
      <ImageDropzone
        disabled={disabled}
        onChange={handleChangeFile}
        title={title}
      />
      {!!imgSrc && (
        <div>
          <h3>{t('common.imageUploader.titleCropImage')}</h3>
          <div className={styles.imageCropperWrapper}>
            <ImageCropper imgUrl={imgSrc} onChange={handleChangeCrop} />
          </div>
          <Button
            className={styles.removeButton}
            iconLeft={<IconMinusCircle aria-hidden={true} />}
            onClick={removeImageFile}
            type="button"
            variant="danger"
          >
            {t('common.imageUploader.buttonRemoveImage')}
          </Button>
        </div>
      )}
    </>
  );
};

export default ImageUploader;
