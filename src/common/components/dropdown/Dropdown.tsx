import { ClassNames } from '@emotion/react';
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
      <ClassNames>
        {({ css, cx }) => (
          <div
            className={cx(styles.dropdown, className, css(theme.dropdown))}
            ref={ref}
          >
            {children}
          </div>
        )}
      </ClassNames>
    );
  }
);

export default Dropdown;
