import { IconAngleDown, IconAngleUp, IconProps, IconSize } from 'hds-react';
import React, { FC } from 'react';

export type CollapseButtonProps = {
  ariaLabel: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  open: boolean;
};
const CollapseButton: FC<CollapseButtonProps> = ({
  ariaLabel,
  onClick,
  open,
}) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onClick(event);
  };

  const iconProps: IconProps = { 'aria-hidden': true, size: IconSize.Small };

  return (
    <button aria-label={ariaLabel} onClick={handleClick}>
      {open ? <IconAngleUp {...iconProps} /> : <IconAngleDown {...iconProps} />}
    </button>
  );
};

export default CollapseButton;
