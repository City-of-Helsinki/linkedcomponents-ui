import classNames from 'classnames';
import React from 'react';
import { useLocation } from 'react-router';
import { scroller } from 'react-scroll';

import { MAIN_CONTENT_ID } from '../../../../constants';
import styles from './mainContent.module.scss';

interface Props {
  className?: string;
  duration?: number;
  // This is mainly for testing purposes to test that the scroll function is called properly
  onScrollFn?: () => void;
  offset?: number;
}

const MainContent: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  duration = 100,
  offset = -130,
  onScrollFn,
}) => {
  const { hash } = useLocation();
  const mainContent = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (hash === `#${MAIN_CONTENT_ID}`) {
      const scrollToContent = () => {
        if (onScrollFn) {
          onScrollFn();
        } else {
          scroller.scrollTo(MAIN_CONTENT_ID, {
            delay: 0,
            duration: duration,
            offset: offset,
            smooth: true,
          });
        }
      };

      const setFocusToFirstFocusable = () => {
        const focusable = mainContent.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusable?.[0]) {
          (focusable[0] as HTMLElement).focus();
        }
      };

      scrollToContent();

      setTimeout(() => {
        setFocusToFirstFocusable();
      }, duration);
    }
  }, [duration, hash, offset, onScrollFn]);

  return (
    <main
      className={classNames(styles.mainContent, className)}
      id={MAIN_CONTENT_ID}
      ref={mainContent}
    >
      {children}
    </main>
  );
};

export default MainContent;
