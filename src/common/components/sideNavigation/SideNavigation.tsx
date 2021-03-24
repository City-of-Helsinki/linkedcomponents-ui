import classNames from 'classnames';
import { css } from 'emotion';
import { IconAngleDown, IconAngleUp } from 'hds-react';
import uniqueId from 'lodash/uniqueId';
import React, { useContext } from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import useBreakpoint from '../../../hooks/useBreakpoint';
import useDropdownCloseEvents from '../../../hooks/useDropdownCloseEvents';
import { FCWithName } from '../../../types';
import Button from '../button/Button';
import styles from './sideNavigation.module.scss';
import SideNavigationContext from './SideNavigationContext';

export type SideNavigationProps = React.PropsWithChildren<{
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  toggleButtonLabel: string;
}>;

const SideNavigation = ({
  children,
  className,
  id: _id,
  style = {},
  toggleButtonLabel,
}: SideNavigationProps) => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useContext(
    SideNavigationContext
  );

  const container = React.useRef<HTMLDivElement>(null);
  useDropdownCloseEvents({ container, setIsMenuOpen: setIsMobileMenuOpen });

  const breakpoint = useBreakpoint();
  const isMobile = React.useMemo(
    () => breakpoint === 'xs' || breakpoint === 'sm',
    [breakpoint]
  );

  const id = _id ?? uniqueId('side-navigation-');
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;

  const { theme } = useTheme();

  const mainLevels = React.Children.map(children, (child, index) => {
    /* istanbul ignore else  */
    if (
      React.isValidElement(child) &&
      (child.type as FCWithName).componentName === 'MainLevel'
    ) {
      return React.cloneElement(child, { id: `${id}-${index}`, index });
    } else {
      return null;
    }
  });

  const toggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={classNames(
        styles.sideNavigation,
        css(theme.sideNavigation),
        className
      )}
      id={id}
      ref={container}
      style={style}
    >
      {isMobile && (
        <Button
          aria-controls={menuId}
          aria-expanded={isMobileMenuOpen}
          aria-haspopup={true}
          fullWidth={true}
          iconRight={isMobileMenuOpen ? <IconAngleUp /> : <IconAngleDown />}
          onClick={toggle}
          variant="secondary"
          type="button"
        >
          {toggleButtonLabel}
        </Button>
      )}
      <ul
        {...(isMobile
          ? {
              className: classNames(styles.mainLevelListMobile, {
                [styles.open]: isMobileMenuOpen,
              }),
              role: 'region',
              'aria-labelledby': buttonId,
              'aria-hidden': !isMobileMenuOpen,
            }
          : { className: styles.mainLevelList })}
        id={menuId}
      >
        {mainLevels}
      </ul>
    </nav>
  );
};

const SideNavigationWrapper = (props: SideNavigationProps) => {
  const [openMainLevels, setOpenMainLevels] = React.useState<number[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  return (
    <SideNavigationContext.Provider
      value={{
        isMobileMenuOpen,
        openMainLevels,
        setIsMobileMenuOpen,
        setOpenMainLevels,
      }}
    >
      <SideNavigation {...props} />
    </SideNavigationContext.Provider>
  );
};

export default SideNavigationWrapper;
