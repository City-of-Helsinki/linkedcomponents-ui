import classNames from 'classnames';
import { css } from 'emotion';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './dropdown.module.scss';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Dropdown = React.forwardRef<HTMLDivElement, Props>(
  ({ className, children }, ref) => {
    const { theme } = useTheme();

    return (
      <div
        className={classNames(styles.dropdown, className, css(theme.dropdown))}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export default Dropdown;
