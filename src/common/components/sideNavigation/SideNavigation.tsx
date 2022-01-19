import { css } from '@emotion/css';
import classNames from 'classnames';
import {
  SideNavigation as BaseSideNavigation,
  SideNavigationProps,
} from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const SideNavigation = ({
  children,
  className,
  ...rest
}: SideNavigationProps): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <BaseSideNavigation
      {...rest}
      className={classNames(className, css(theme.sideNavigation))}
    >
      {children}
    </BaseSideNavigation>
  );
};

SideNavigation.MainLevel = BaseSideNavigation.MainLevel;
SideNavigation.SubLevel = BaseSideNavigation.SubLevel;

export default SideNavigation;
