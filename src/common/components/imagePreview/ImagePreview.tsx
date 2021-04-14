import { ResizeObserver } from '@juggle/resize-observer';
import { IconPhoto } from 'hds-react';
import React from 'react';
import useMeasure from 'react-use-measure';

import styles from './imagePreview.module.scss';

export const testIds = {
  image: 'image-preview-image',
};

const RATIO = 2 / 3;

type ContainerStyles = {
  height?: number;
};

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
  const [ref, menuContainerSize] = useMeasure({
    scroll: false,
    polyfill: ResizeObserver,
  });
  const containerStyles: ContainerStyles = React.useMemo(() => {
    const { width } = menuContainerSize;
    // the menu width should be at least 190px
    const height = width * RATIO;
    return {
      height,
    };
  }, [menuContainerSize]);

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
      ref={ref}
      role="button"
      style={containerStyles}
      tabIndex={0}
    >
      {imageUrl ? (
        <div
          data-testid={testIds.image}
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
