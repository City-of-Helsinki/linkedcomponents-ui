import { ResizeObserver } from '@juggle/resize-observer';
import classNames from 'classnames';
import { IconPhoto } from 'hds-react';
import React from 'react';
import useMeasure from 'react-use-measure';

import { testIds } from '../../../constants';
import styles from './imagePreview.module.scss';

const RATIO = 2 / 3;

type ContainerStyles = {
  height?: number;
};

export interface ImagePreviewProps {
  className?: string;
  disabled?: boolean;
  imageUrl?: string | null;
  label: string;
  onClick: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  className,
  disabled,
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
      className={classNames(styles.imagePreview, className, {
        [styles.disabled]: disabled,
      })}
      onClick={
        /* istanbul ignore next */
        disabled ? () => undefined : onClick
      }
      onKeyDown={
        /* istanbul ignore next */
        disabled ? () => undefined : handleKeyDown
      }
      ref={ref}
      role="button"
      style={containerStyles}
      tabIndex={0}
    >
      {imageUrl ? (
        <div
          data-testid={testIds.imagePreview.image}
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
