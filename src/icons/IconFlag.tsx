import classNames from 'classnames';
import { IconProps } from 'hds-react';
import React from 'react';

import styles from './icon.module.scss';

const IconFlag = ({
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
      <path
        // eslint-disable-next-line max-len
        d="M14.9062 7.09375C13.2188 7.09375 11.8438 6 9.75 6C8.96875 6 8.28125 6.15625 7.625 6.40625C7.6875 6.1875 7.71875 6 7.71875 5.78125C7.71875 5.71875 7.71875 5.6875 7.71875 5.65625C7.6875 4.78125 6.9375 4.0625 6.0625 4.03125C5.0625 3.96875 4.25 4.78125 4.25 5.75C4.25 6.375 4.53125 6.875 5 7.1875V19.25C5 19.6875 5.3125 20 5.75 20H6.25C6.65625 20 7 19.6875 7 19.25V16.3125C7.875 15.9375 8.96875 15.625 10.5625 15.625C12.25 15.625 13.625 16.7188 15.7188 16.7188C17.2188 16.7188 18.4375 16.1875 19.5625 15.4375C19.8125 15.25 20 14.9375 20 14.625V7C20 6.28125 19.2188 5.8125 18.5625 6.09375C17.5 6.59375 16.1875 7.09375 14.9062 7.09375Z"
        fill="currentColor"
      />
    </g>
  </svg>
);

export default IconFlag;
