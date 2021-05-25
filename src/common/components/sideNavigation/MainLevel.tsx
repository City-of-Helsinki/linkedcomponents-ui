import classNames from 'classnames';
import { IconAngleDown } from 'hds-react';
import uniqueId from 'lodash/uniqueId';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { FCWithName } from '../../../types';
import styles from './sideNavigation.module.scss';
import SideNavigationContext from './SideNavigationContext';

export type MainLevelProps = React.PropsWithChildren<{
  active: boolean;
  className?: string;
  icon: React.ReactNode;
  id?: string;
  index?: number;
  label: string;
  style?: React.CSSProperties;
  to: string;
}>;

const MainLevel: FCWithName<MainLevelProps> = ({
  active,
  children,
  className,
  icon,
  id: _id,
  index,
  label,
  style,
  to,
}) => {
  const id = React.useRef<string>(
    _id || /* istanbul ignore next */ uniqueId('main-level-')
  ).current;
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const { openMainLevels, setIsMobileMenuOpen, setOpenMainLevels } = useContext(
    SideNavigationContext
  );

  const isOpen = openMainLevels.includes(index as number);

  const subLevels = React.Children.map(children, (child, subLevelIndex) => {
    /* istanbul ignore else  */
    if (
      React.isValidElement(child) &&
      (child.type as FCWithName).componentName === 'SubLevel'
    ) {
      return React.cloneElement(child, {
        id: `${id}-${subLevelIndex}`,
        mainLevelIndex: index,
      });
    } else {
      return null;
    }
  })?.filter((el) => el);

  React.useEffect(() => {
    if (active && !openMainLevels.includes(index as number)) {
      // Only one level can be open at same time
      setOpenMainLevels([index as number]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const hasSublevels = Boolean(subLevels?.length);

  return (
    <li
      className={classNames(
        styles.mainLevel,
        { [styles.active]: active, [styles.open]: isOpen },
        className
      )}
      style={style}
    >
      <Link
        aria-current={active ? 'page' : 'false'}
        aria-label={label}
        id={buttonId}
        onClick={() => {
          // Only one level can be open at same time
          setOpenMainLevels([index as number]);

          if (!hasSublevels) {
            setIsMobileMenuOpen(false);
          }
        }}
        to={to}
      >
        <span className={styles.iconWrapper} aria-hidden={true}>
          {icon}
        </span>
        <span>{label}</span>
        {hasSublevels && (
          <span className={styles.arrowIcon} aria-hidden={true}>
            <IconAngleDown />
          </span>
        )}
      </Link>

      {hasSublevels && (
        <ul
          className={styles.mainLevelListMenu}
          id={menuId}
          aria-hidden={!isOpen}
          aria-labelledby={buttonId}
        >
          {subLevels}
        </ul>
      )}
    </li>
  );
};
MainLevel.componentName = 'MainLevel';

export default MainLevel;
