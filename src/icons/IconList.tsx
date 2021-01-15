import classNames from 'classnames';
import { IconProps } from 'hds-react';
import React from 'react';

import styles from './icon.module.scss';

const IconList = ({
  size = 's',
  className = '',
  style = {},
  ...rest
}: IconProps) => (
  <svg
    className={classNames(styles.icon, styles[size], className)}
    style={style}
    viewBox="0 0 24 24"
    {...rest}
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" fillRule="evenodd">
      <rect x="10" y="11" width="8" height="2" fill="currentColor" />
      <rect x="6" y="11" width="2" height="2" fill="currentColor" />
      <rect x="10" y="7" width="8" height="2" fill="currentColor" />
      <rect x="6" y="7" width="2" height="2" fill="currentColor" />
      <rect x="10" y="15" width="8" height="2" fill="currentColor" />
      <rect x="6" y="15" width="2" height="2" fill="currentColor" />
    </g>
  </svg>
);

export default IconList;
