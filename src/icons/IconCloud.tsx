import classNames from 'classnames';
import { IconProps } from 'hds-react';
import React from 'react';

import styles from './icon.module.scss';

const IconCloud = ({
  size = 's',
  className = '',
  style = {},
  ...rest
}: IconProps) => (
  <svg
    className={classNames(styles.icon, styles[size], className)}
    style={style}
    viewBox="0 0 176 176"
    {...rest}
    role="img"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M84.3334 31.168C103.085 31.168 120.027 42.5462 126.396 59.9947L126.746 60.989L127.707 61.1416C146.996 64.4262 160.832 79.7056 161.32 99.7373L161.333 100.835C161.333 123.87 145.197 140.629 122.471 141.155L121.367 141.168H113.667V126.501H121.367C136.52 126.501 146.667 116.193 146.667 100.835C146.667 86.447 136.413 76.039 121.734 75.2052L120.791 75.165L114.954 74.9985L113.809 69.2728C111.023 55.344 98.5138 45.8346 84.3334 45.8346C67.9277 45.8346 55.8957 57.2639 55.0485 73.3393L55.0116 74.2902L54.91 82.4408L46.4246 82.5104C35.4981 82.8268 26.4001 93.1564 26.4001 105.235C26.4001 116.707 35.4838 126.057 46.851 126.486L47.6667 126.501H113.667V141.168H47.6667C27.8213 141.168 11.7334 125.08 11.7334 105.235C11.7334 87.5601 23.8504 71.9745 40.2969 68.5365L40.8064 68.436L40.9703 67.3708C44.4036 46.5452 61.3386 31.6788 83.1984 31.1809L84.3334 31.168Z"
      fill="currentColor"
    />
  </svg>
);

export default IconCloud;
