import { ClassNames } from '@emotion/react';
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
    <ClassNames>
      {({ css, cx }) => (
        <BaseSideNavigation
          {...rest}
          className={cx(className, css(theme.sideNavigation))}
        >
          {children}
        </BaseSideNavigation>
      )}
    </ClassNames>
  );
};

SideNavigation.MainLevel = BaseSideNavigation.MainLevel;
SideNavigation.SubLevel = BaseSideNavigation.SubLevel;

export default SideNavigation;
