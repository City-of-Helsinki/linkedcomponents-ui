import classNames from 'classnames';
import { css } from 'emotion';
import { IconAngleDown, IconAngleUp } from 'hds-react';
import uniqueId from 'lodash/uniqueId';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './collapsible.module.scss';

const generateUniqueId = (prefix = 'collapsible') => `${prefix}-${uniqueId()}`;

type Props = {
  headingLevel: number;
  title: string;
};

const Collabsible: React.FC<Props> = ({
  children,
  headingLevel = 3,
  title,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const collapsibleHeadingId = React.useMemo(
    () => generateUniqueId('collapsible-heading'),
    []
  );
  const collapsiblePanelId = React.useMemo(
    () => generateUniqueId('collapsible-panel'),
    []
  );

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      togglePanel();
    }
  };

  return (
    <div
      className={classNames(styles.collapsible, css(theme.collapsible), {
        [styles.expanded]: isOpen,
      })}
    >
      <div role="heading" aria-level={headingLevel}>
        <div
          className={styles.button}
          id={collapsibleHeadingId}
          aria-expanded={isOpen}
          aria-controls={collapsiblePanelId}
          onClick={togglePanel}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
        >
          {isOpen ? <IconAngleUp size="m" /> : <IconAngleDown size="m" />}
          {title}
        </div>
      </div>
      <div
        className="accordion__panel"
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
