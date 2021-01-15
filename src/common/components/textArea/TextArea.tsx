import classNames from 'classnames';
import { css } from 'emotion';
import { TextArea as BaseTextArea, TextAreaProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const TextArea: React.FC<TextAreaProps> = ({ className, ...rest }) => {
  const { theme } = useTheme();

  return (
    <BaseTextArea
      {...rest}
      className={classNames(className, css(theme.textInput))}
    />
  );
};

export default TextArea;
