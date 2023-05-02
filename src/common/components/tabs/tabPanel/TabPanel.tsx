import React, { FC } from 'react';

export type TabPanelProps = React.PropsWithChildren<{
  className?: string;
  index?: number;
  isActive?: boolean;
  name?: string;
  style?: React.CSSProperties;
}>;

const TabPanel: FC<TabPanelProps> = ({
  children,
  className,
  index,
  isActive,
  name,
  style,
}) => {
  return isActive ? (
    <div
      id={`tab-${name}-${index}-panel`}
      role="tabpanel"
      aria-labelledby={`tab-${name}-${index}-button`}
      className={className}
      style={style}
    >
      {children}
    </div>
  ) : null;
};

TabPanel.displayName = 'TabPanel';

export default TabPanel;
