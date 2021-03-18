import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

const SubLevel = ({
  active,
  className,
  id: _id,
  label,
  mainLevelIndex,
  style,
  to,
}: SubLevelProps) => {
  const id = _id ?? uniqueId('side-navigation-');
  const { openMainLevels, setOpenMainLevels } = useContext(
    SideNavigationContext
  );

  useEffect(() => {
    if (active && !openMainLevels.includes(mainLevelIndex as number)) {
      setOpenMainLevels([...openMainLevels, mainLevelIndex as number]);
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
      <Link aria-current={active ? 'page' : 'false'} to={to}>
        {label}
      </Link>
    </li>
  );
};
SubLevel.componentName = 'SubLevel';

export default SubLevel;
