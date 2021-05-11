import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { FCWithName } from '../../../types';
import styles from './sideNavigation.module.scss';
import SideNavigationContext from './SideNavigationContext';

export type SubLevelProps = {
  active: boolean;
  className?: string;
  id?: string;
  label: string;
  mainLevelIndex?: number;
  style?: React.CSSProperties;
  to: string;
};

const SubLevel: FCWithName<SubLevelProps> = ({
  active,
  className,
  id: _id,
  label,
  mainLevelIndex,
  style,
  to,
}) => {
  const id = React.useRef<string>(_id || uniqueId('sub-level-')).current;
  const { openMainLevels, setIsMobileMenuOpen, setOpenMainLevels } = useContext(
    SideNavigationContext
  );

  useEffect(() => {
    if (active && !openMainLevels.includes(mainLevelIndex as number)) {
      // Only one level can be open at same time
      setOpenMainLevels([mainLevelIndex as number]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <li
      className={classNames(
        styles.subLevel,
        { [styles.active]: active },
        className
      )}
      id={id}
      style={style}
    >
      <Link
        aria-current={active ? 'page' : 'false'}
        onClick={() => {
          setIsMobileMenuOpen(false);
        }}
        to={to}
      >
        {label}
      </Link>
    </li>
  );
};

SubLevel.componentName = 'SubLevel';

export default SubLevel;
