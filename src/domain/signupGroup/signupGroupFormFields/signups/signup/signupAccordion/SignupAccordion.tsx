import { IconAngleDown, IconAngleUp, Tooltip } from 'hds-react';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import useIdWithPrefix from '../../../../../../hooks/useIdWithPrefix';
import styles from './signupAccordion.module.scss';

export interface SignupAccordionProps {
  deleteButton?: React.ReactElement;
  id?: string;
  inWaitingList: boolean;
  onClick: () => void;
  open: boolean;
  toggleButtonLabel: string;
}

type ToggleButtonProps = {
  'aria-controls': string;
  'aria-expanded': boolean;
  'aria-label': string;
  id: string;
  onClick: (e: React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
};

type ContentProps = {
  'aria-label': string;
  id: string;
  style?: React.CSSProperties;
};

const SignupAccordion: React.FC<
  React.PropsWithChildren<SignupAccordionProps>
> = ({
  children,
  deleteButton,
  id: _id,
  inWaitingList,
  onClick,
  open,
  toggleButtonLabel,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const id = useIdWithPrefix({ id: _id, prefix: 'accordion-' });
  const contentId = `${id}-content`;
  const toggleId = `${id}-toggle`;

  const isEventFromTooltip = (e: React.MouseEvent | React.KeyboardEvent) =>
    e.target instanceof Node && tooltipRef.current?.contains(e.target);

  const toggleButtonProps: ToggleButtonProps = {
    'aria-controls': contentId,
    'aria-expanded': open,
    'aria-label': toggleButtonLabel,
    id: toggleId,
    onClick: (e: React.MouseEvent) => {
      /* istanbul ignore else */
      if (!isEventFromTooltip(e)) {
        onClick();
      }
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      /* istanbul ignore else */
      if (e.key === 'Enter' && !isEventFromTooltip(e)) {
        onClick();
      }
    },
  };

  const commonContentProps = {
    'aria-label': toggleButtonLabel,
    id: contentId,
  };
  const contentProps: ContentProps = open
    ? { ...commonContentProps }
    : { ...commonContentProps, style: { display: 'none' } };

  const icon = open ? (
    <IconAngleUp aria-hidden />
  ) : (
    <IconAngleDown aria-hidden />
  );

  return (
    <div className={styles.accordion}>
      <div className={styles.headingWrapper}>
        <div
          {...toggleButtonProps}
          tabIndex={0}
          className={styles.toggleButton}
          role="button"
        >
          <span aria-hidden={true}>{icon}</span>
          <span className={styles.label}>
            {toggleButtonLabel}
            {inWaitingList && (
              <div className={styles.waitingListIndicator}>
                {<div className={styles.separator}>—</div>}
                {t('signup.inWaitingList.text')}
                <div ref={tooltipRef}>
                  <Tooltip className={styles.tooltip}>
                    {t('signup.inWaitingList.tooltip')}
                  </Tooltip>
                </div>
              </div>
            )}
          </span>
        </div>
        {deleteButton}
      </div>

      <div {...contentProps} className={styles.content} role="region">
        {open && children}
      </div>
    </div>
  );
};

export default SignupAccordion;
