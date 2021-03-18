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
  type: 'link' | 'toggle';
}>;

const MainLevel = ({
  active,
  children,
  className,
  icon,
  id: _id,
  index,
  label,
  style,
  to,
  type,
}: MainLevelProps) => {
  const id = _id ?? uniqueId('side-navigation-');
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const { openMainLevels, setIsMobileMenuOpen, setOpenMainLevels } = useContext(
    SideNavigationContext
  );

  const isOpen = openMainLevels.includes(index as number);

  const subLevels = React.Children.map(children, (child, subLevelIndex) => {
    if (
      React.isValidElement(child) &&
      (child.type as FCWithName).componentName === 'SubLevel'
    ) {
      return React.cloneElement(child, {
        id: `${id}-${subLevelIndex}`,
        mainLevelIndex: index,
      });
    }

    return null;
  })?.filter((el) => el);

  React.useEffect(() => {
    if (active && !openMainLevels.includes(index as number)) {
      setOpenMainLevels([...openMainLevels, index as number]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const toggleMenu = () => {
    setOpenMainLevels(
      openMainLevels.includes(index as number)
        ? openMainLevels.filter((n) => n !== (index as number))
        : [...openMainLevels, index as number]
    );
  };
  return (
    <li
      className={classNames(
        styles.mainLevel,
        { [styles.active]: active, [styles.open]: isOpen },
        className
      )}
      style={style}
    >
      {type === 'link' && (
        <Link
          aria-current={active ? 'page' : 'false'}
          onClick={() => {
            setIsMobileMenuOpen(false);
          }}
          to={to}
        >
          <span className={styles.iconWrapper} aria-hidden={true}>
            {icon}
          </span>
          <span>{label}</span>
        </Link>
      )}
      {type === 'toggle' && (
        <button
          id={buttonId}
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-haspopup={true}
          onClick={toggleMenu}
          type="button"
        >
          <span className={styles.iconWrapper} aria-hidden={true}>
            {icon}
          </span>
          <span>{label}</span>
          <span className={styles.arrowIcon} aria-hidden={true}>
            <IconAngleDown />
          </span>
        </button>
      )}

      {Boolean(subLevels?.length) && (
        <ul
          role="region"
          aria-labelledby={buttonId}
          className={styles.mainLevelListMenu}
          id={menuId}
        >
          {subLevels}
        </ul>
      )}
    </li>
  );
};
MainLevel.componentName = 'MainLevel';

export default MainLevel;
