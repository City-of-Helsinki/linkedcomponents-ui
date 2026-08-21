import { ClassNames } from '@emotion/react';
import { IconAngleDown, IconAngleUp, IconSize } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import sanitizeElementId from '../../../utils/sanitizeElementId';
import styles from './collapsible.module.scss';

type Props = {
  defaultOpen?: boolean;
  headingLevel?: number;
  title: string;
};

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

const Collabsible: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  defaultOpen = false,
  headingLevel = 3,
  title,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const id = sanitizeElementId(React.useId());
  const collapsibleHeadingId = `collapsible-heading-${id}`;
  const collapsiblePanelId = `collapsible-panel-${id}`;

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const HeadingEl = HEADING_TAGS[headingLevel - 1] ?? 'h3';

  return (
    <ClassNames>
      {({ css, cx }) => (
        <div
          className={cx(styles.collapsible, css(theme.collapsible), {
            [styles.expanded]: isOpen,
          })}
        >
          <HeadingEl>
            <button
              className={styles.button}
              id={collapsibleHeadingId}
              aria-expanded={isOpen}
              aria-controls={collapsiblePanelId}
              onClick={togglePanel}
              type="button"
            >
              {isOpen ? (
                <IconAngleUp size={IconSize.Medium} />
              ) : (
                <IconAngleDown size={IconSize.Medium} />
              )}
              <span>{title}</span>
            </button>
          </HeadingEl>
          <section
            aria-labelledby={collapsibleHeadingId}
            id={collapsiblePanelId}
            hidden={!isOpen}
          >
            {children}
          </section>
        </div>
      )}
    </ClassNames>
  );
};

export default Collabsible;
