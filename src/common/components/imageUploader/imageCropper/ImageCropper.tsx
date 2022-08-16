import 'react-image-crop/dist/ReactCrop.css';

import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCrop, {
  centerCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from 'react-image-crop';

type Props = {
  imgUrl: string;
  onChange: (crop: PixelCrop, imageEl: HTMLImageElement) => void;
};

const aspect = 3 / 2;

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) =>
  centerCrop(
    makeAspectCrop({ unit: '%', width: 100 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );

const ImageCropper: React.FC<Props> = ({ imgUrl, onChange }) => {
  const { t } = useTranslation();
  const [crop, setCrop] = useState<Crop>();
  const imageRef = useRef<HTMLImageElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  return (
    <ReactCrop
      style={{ minWidth: '100%' }}
      ariaLabels={{
        cropArea: t('common.imageUploader.cropArea'),
        nwDragHandle: t('common.imageUploader.nwDragHandle'),
        nDragHandle: t('common.imageUploader.nDragHandle'),
        neDragHandle: t('common.imageUploader.neDragHandle'),
        eDragHandle: t('common.imageUploader.eDragHandle'),
        seDragHandle: t('common.imageUploader.seDragHandle'),
        sDragHandle: t('common.imageUploader.sDragHandle'),
        swDragHandle: t('common.imageUploader.swDragHandle'),
        wDragHandle: t('common.imageUploader.wDragHandle'),
      }}
      aspect={aspect}
      crop={crop}
      keepSelection={true}
      minHeight={200}
      minWidth={300}
      onChange={(_, percentCrop) => setCrop(percentCrop)}
      onComplete={(c) => onChange(c, imageRef.current as HTMLImageElement)}
    >
      <img
        alt=""
        style={{ minWidth: '100%' }}
        ref={imageRef}
        src={imgUrl}
        onLoad={onImageLoad}
      />
    </ReactCrop>
  );
};
export default ImageCropper;
