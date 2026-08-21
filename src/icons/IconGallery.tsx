import classNames from 'classnames';
import { IconProps } from 'hds-react';
import React from 'react';

import styles from './icon.module.scss';

const IconGallery: React.FC<IconProps> = ({
  size = 's',
  className = '',
  style = {},
  'aria-label': ariaLabel = 'Gallery',
  ...rest
}) => (
  <svg
    className={classNames(styles.icon, styles[size], className)}
    style={style}
    viewBox="0 0 24 24"
    {...rest}
    aria-label={ariaLabel}
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" fillRule="evenodd">
      <rect x="6" y="6" width="5" height="5" fill="currentColor" />
      <rect x="6" y="13" width="5" height="5" fill="currentColor" />
      <rect x="13" y="6" width="5" height="5" fill="currentColor" />
      <rect x="13" y="13" width="5" height="5" fill="currentColor" />
    </g>
  </svg>
);

export default IconGallery;
