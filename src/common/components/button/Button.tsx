import { Button as BaseButton, ButtonProps } from 'hds-react/components/Button';
import React from 'react';

const Button: React.FC<ButtonProps> = (props) => {
  return <BaseButton {...props} />;
};

export default Button;
