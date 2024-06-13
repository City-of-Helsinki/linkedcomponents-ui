import classNames from 'classnames';
import { Tooltip } from 'hds-react';
import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './headingWithTooltip.module.scss';

export type HeadingWithTooltipProps = {
  className?: string;
  heading: string;
  showTooltip: boolean;
  tag: 'h2' | 'h3';
  tooltipContent: ReactNode;
  tooltipLabel: string;
};

const HeadingWithTooltip: FC<HeadingWithTooltipProps> = ({
  className,
  heading,
  showTooltip,
  tag: Heading,
  tooltipContent,
  tooltipLabel,
}) => {
  const { t } = useTranslation();
  return (
    <Heading
      className={classNames(
        { [styles.headingWithTooltip]: showTooltip },
        className
      )}
    >
      {heading}
      {showTooltip && (
        <Tooltip
          buttonClassName={styles.tooltipButton}
          buttonLabel={t('common.showInstructions')}
          tooltipClassName={styles.tooltipContent}
          tooltipLabel={tooltipLabel}
        >
          {tooltipContent}
        </Tooltip>
      )}
    </Heading>
  );
};

export default HeadingWithTooltip;
