import classNames from 'classnames';
import { IconCheck } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useDropdownKeyboardNavigation from '../../../../hooks/useDropdownKeyboardNavigation';
import { TimeObject } from '../../../../types';
import ScrollIntoViewWithFocus from '../../scrollIntoViewWithFocus/ScrollIntoViewWithFocus';
import { DEFAULT_TIME_INTERVAL } from '../../timepicker/constants';
import { formatTime, getTimeObjects } from '../../timepicker/utils';
import styles from '../datepicker.module.scss';

type TimesListProps = {
  datetime: Date | null;
  minuteInterval?: number;
  onTimeClick: (time: TimeObject) => void;
};

const TimesList = React.forwardRef<HTMLDivElement, TimesListProps>(
  (
    { datetime, minuteInterval = DEFAULT_TIME_INTERVAL, onTimeClick },
    forwardedRef
  ) => {
    const { t } = useTranslation();

    const times = React.useMemo(
      () => getTimeObjects(minuteInterval),
      [minuteInterval]
    );

    const findSelectedIndex = React.useCallback(() => {
      if (datetime) {
        const index = times.findIndex(
          (time) =>
            datetime.getHours() === time.hours &&
            datetime.getMinutes() === time.minutes
        );
        return Math.max(0, index);
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
          ref={forwardedRef}
          aria-label={t('common.datepicker.accessibility.timeInstructions')}
          className={styles.timesListContainer}
          tabIndex={0}
        >
          <div className={styles.timesList}>
            {times.map((time, index) => (
              <TimeItem
                key={index}
                focused={focusedIndex === index}
                index={index}
                label={t('common.datepicker.accessibility.selectTime', {
                  value: formatTime(time),
                })}
                onTimeClick={onTimeClick}
                selected={selectedIndex === index}
                setFocusedIndex={setFocusedIndex}
                time={time}
              />
            ))}
          </div>
        </div>
      </>
    );
  }
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
        ref={buttonRef}
        className={classNames(styles.timeItem, {
          [styles.selectedTimeItem]: selected,
        })}
        aria-label={label}
        onClick={() => onTimeClick(time)}
        onMouseEnter={handleMouseEnter}
        tabIndex={focused ? 0 : -1}
        type="button"
      >
        {formatTime(time)}
        {selected && <IconCheck aria-hidden={true} />}
      </button>
    </ScrollIntoViewWithFocus>
  );
};

export default TimesList;
