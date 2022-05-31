import { css } from '@emotion/css';
import classNames from 'classnames';
import { IconAngleDown, IconAngleUp } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './collapsible.module.scss';

type Props = {
  defaultOpen?: boolean;
  headingLevel?: number;
  title: string;
};

const Collabsible: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  defaultOpen = false,
  headingLevel = 3,
  title,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const id = React.useId();
  const collapsibleHeadingId = `collapsible-heading-${id}`;
  const collapsiblePanelId = `collapsible-panel-${id}`;

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={classNames(styles.collapsible, css(theme.collapsible), {
        [styles.expanded]: isOpen,
      })}
    >
      <div role="heading" aria-level={headingLevel}>
        <button
          className={styles.button}
          id={collapsibleHeadingId}
          aria-expanded={isOpen}
          aria-controls={collapsiblePanelId}
          onClick={togglePanel}
          type="button"
        >
          {isOpen ? <IconAngleUp size="m" /> : <IconAngleDown size="m" />}
          <span>{title}</span>
        </button>
      </div>
      <div
        role="region"
        aria-labelledby={collapsibleHeadingId}
        id={collapsiblePanelId}
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
};

export default Collabsible;
