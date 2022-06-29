import { IconAngleDown, IconAngleUp } from 'hds-react';
import React from 'react';

import useIdWithPrefix from '../../../../../../hooks/useIdWithPrefix';
import styles from './attendeeAccordion.module.scss';

export interface AttendeeAccordionProps {
  deleteButton?: React.ReactElement;
  id?: string;
  onClick: () => void;
  open: boolean;
  toggleButtonLabel: string;
}

type ToggleButtonProps = {
  'aria-controls': string;
  'aria-expanded': boolean;
  'aria-label': string;
  id: string;
  onClick: () => void;
};

type ContentProps = {
  'aria-label': string;
  id: string;
  style?: React.CSSProperties;
};

const AttendeeAccordion: React.FC<
  React.PropsWithChildren<AttendeeAccordionProps>
> = ({ children, deleteButton, id: _id, onClick, open, toggleButtonLabel }) => {
  const id = useIdWithPrefix({ id: _id, prefix: 'accordion-' });
  const contentId = `${id}-content`;
  const toggleId = `${id}-toggle`;

  const toggleButtonProps: ToggleButtonProps = {
    'aria-controls': contentId,
    'aria-expanded': open,
    'aria-label': toggleButtonLabel,
    id: toggleId,
    onClick,
  };

  const commonContentProps = { 'aria-label': toggleButtonLabel, id: contentId };
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
        <button
          {...toggleButtonProps}
          className={styles.toggleButton}
          type="button"
        >
          <span aria-hidden={true}>{icon}</span>
          <span>{toggleButtonLabel}</span>
        </button>
        {deleteButton}
      </div>

      <div {...contentProps} className={styles.content} role="region">
        {open && children}
      </div>
    </div>
  );
};

export default AttendeeAccordion;
