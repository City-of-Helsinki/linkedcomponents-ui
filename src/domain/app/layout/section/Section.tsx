import classNames from 'classnames';
import React from 'react';

import HeadingWithTooltip from '../../../../common/components/headingWithTooltip/HeadingWithTooltip';
import styles from './section.module.scss';

type Props = {
  className?: string;
  showTooltip?: boolean;
  title: string;
  tooltipContent?: React.ReactElement;
  tooltipLabel?: string;
};

const Section: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  showTooltip = false,
  title,
  tooltipContent,
  tooltipLabel,
}) => {
  return (
    <div className={classNames(styles.section, className)}>
      {tooltipContent ? (
        <HeadingWithTooltip
          heading={title}
          showTooltip={showTooltip}
          tag="h2"
          tooltipContent={tooltipContent}
          tooltipLabel={tooltipLabel ?? title}
        />
      ) : (
        <h2>{title}</h2>
      )}

      {children}
    </div>
  );
};

export default Section;
