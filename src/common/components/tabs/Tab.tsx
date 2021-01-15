import classNames from 'classnames';
import { IconCheck } from 'hds-react';
import React from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import useIsMounted from '../../../hooks/useIsMounted';
import { OptionType } from '../../../types';
import styles from './tabs.module.scss';

interface TabProps {
  index: number;
  isActive: boolean;
  isCompleted?: boolean;
  isFocused?: boolean;
  name: string;
  onClick: (value: string) => void;
  option: OptionType;
  setFocusedTab: (tab: number) => void;
}

const Tab: React.FC<TabProps> = ({
  index,
  isActive,
  isCompleted,
  isFocused,
  name,
  onClick,
  option,
  setFocusedTab,
}) => {
  const isMounted = useIsMounted();
  const ref = React.useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    onClick(option.value);
  };

  useDeepCompareEffect(() => {
    if (isMounted && isFocused) {
      ref.current?.focus();
    }
  }, [{ index, isFocused }]);

  const onFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!isFocused) {
      setFocusedTab(index);
    }
  };

  return (
    <button
      ref={ref}
      id={`tab-${name}-${index}-button`}
      className={classNames(styles.tab, { [styles.isActive]: isActive })}
      onClick={handleClick}
      onFocus={onFocus}
      aria-controls={`tab-${name}-${index}-panel`}
      aria-selected={isActive}
      role="tab"
      tabIndex={isActive ? 0 : -1}
      type="button"
    >
      {isCompleted ? <IconCheck className={styles.icon} /> : null}
      {option.label}
    </button>
  );
};

export default Tab;
