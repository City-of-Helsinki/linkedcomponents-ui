import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import React from 'react';

import { FCWithName } from '../../../types';
import styles from './sideNavigation.module.scss';
import SideNavigationContext from './SideNavigationContext';

export type SideNavigationProps = React.PropsWithChildren<{
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}>;

const SideNavigation = ({
  children,
  className,
  id: _id,
  style = {},
}: SideNavigationProps) => {
  const id = _id ?? uniqueId('side-navigation-');
  const menuId = `${id}-menu`;
  const [openMainLevels, setOpenMainLevels] = React.useState<number[]>([]);

  const mainLevels = React.Children.map(children, (child, index) => {
    if (
      React.isValidElement(child) &&
      (child.type as FCWithName).componentName === 'MainLevel'
    ) {
      return React.cloneElement(child, { id: `${id}-${index}`, index });
    }

    return null;
  });

  return (
    <SideNavigationContext.Provider
      value={{ openMainLevels, setOpenMainLevels }}
    >
      <nav
        className={classNames(styles.sideNavigation, className)}
        id={id}
        style={style}
      >
        <ul className={styles.mainLevelList} id={menuId}>
          {mainLevels}
        </ul>
      </nav>
    </SideNavigationContext.Provider>
  );
};

export default SideNavigation;
