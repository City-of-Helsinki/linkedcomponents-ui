import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useDropdownKeyboardNavigation from '../../../hooks/useDropdownKeyboardNavigation';
import ScrollIntoViewWithFocus from '../scrollIntoViewWithFocus/ScrollIntoViewWithFocus';
import { TimeObject } from '../timepicker/types';
import { formatTime } from '../timepicker/utils';
import styles from './datepicker.module.scss';

type TimesListProps = {
  times: TimeObject[];
  onTimeClick: (time: TimeObject) => void;
  datetime: Date | null;
};

const TimesList = React.memo(
  React.forwardRef<HTMLDivElement, TimesListProps>(
    ({ times, onTimeClick, datetime }, forwardedRef) => {
      const { t } = useTranslation();
      const findSelectedIndex = React.useCallback(() => {
        if (datetime) {
          const index = times.findIndex(
            (time) =>
              datetime.getHours() === time.hours &&
              datetime.getMinutes() === time.minutes
          );
          return index < 0 ? 0 : index;
        }
        return 0;
      }, [datetime, times]);

      const [selectedIndex, setSelectedIndex] = React.useState<number>(() => {
        return findSelectedIndex();
      });

      const {
        focusedIndex,
        setFocusedIndex,
        setup: setupKeyboardNav,
        teardown: teardownKeyoboardNav,
      } = useDropdownKeyboardNavigation({
        container: forwardedRef as React.MutableRefObject<HTMLDivElement | null>,
        listLength: times.length,
        initialFocusedIndex: findSelectedIndex(),
      });

      React.useEffect(() => {
        setupKeyboardNav();
        return () => {
          teardownKeyoboardNav();
        };
      }, [setupKeyboardNav, teardownKeyoboardNav]);

      React.useEffect(() => {
        setSelectedIndex(findSelectedIndex());
      }, [datetime, findSelectedIndex, setFocusedIndex]);

      return (
        <>
          <div className={styles.timesDivider} />
          <div
            aria-label={t('common.datepicker.accessibility.timeInstructions')}
            className={styles.timesListContainer}
            tabIndex={0}
            ref={forwardedRef}
          >
            <div className={styles.timesList}>
              {times.map((time, index) => (
                <TimeItem
                  key={`${time.hours}:${time.minutes}`}
                  label={t('common.datepicker.accessibility.selectTime', {
                    value: formatTime(time),
                  })}
                  time={time}
                  index={index}
                  selected={selectedIndex === index}
                  focused={focusedIndex === index}
                  setFocusedIndex={setFocusedIndex}
                  onTimeClick={onTimeClick}
                />
              ))}
            </div>
          </div>
        </>
      );
    }
  )
);

type TimeItemProps = {
  time: TimeObject;
  focused: boolean;
  index: number;
  setFocusedIndex: (index: number) => void;
  onTimeClick: (time: TimeObject) => void;
  selected: boolean;
  label: string;
};

const TimeItem: React.FC<TimeItemProps> = ({
  time,
  focused,
  index,
  selected,
  label,
  setFocusedIndex,
  onTimeClick,
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // scroll focused element into view
  React.useEffect(() => {
    if (focused) {
      buttonRef.current?.scrollIntoView?.({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [focused]);

  React.useEffect(() => {
    if (focused) {
      buttonRef.current?.focus();
    }
  }, [focused]);

  const handleMouseEnter = () => {
    setFocusedIndex(index);
  };

  return (
    <ScrollIntoViewWithFocus
      isFocused={selected}
      scrollIntoViewOptions={{ block: 'center', inline: 'center' }}
    >
      <button
        className={classNames(styles.timeItem, {
          [styles.selectedTimeItem]: selected,
        })}
        aria-label={label}
        ref={buttonRef}
        type="button"
        onMouseEnter={handleMouseEnter}
        tabIndex={focused ? 0 : -1}
        onClick={() => onTimeClick(time)}
      >
        {formatTime(time)}
      </button>
    </ScrollIntoViewWithFocus>
  );
};

export default TimesList;
