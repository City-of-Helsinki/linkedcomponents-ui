import { IconPhoto } from 'hds-react';
import React from 'react';

import styles from './imagePreview.module.scss';

export interface ImagePreviewProps {
  imageUrl?: string | null;
  label: string;
  onClick: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  label,
  onClick,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    /* istanbul ignore else  */
    if (event.key === 'Enter') {
      onClick();
    }
  };

  return (
    <div
      aria-label={label}
      className={styles.imagePreview}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      {imageUrl ? (
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div className={styles.placeholderImage}>
          <IconPhoto size="xl" />
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
