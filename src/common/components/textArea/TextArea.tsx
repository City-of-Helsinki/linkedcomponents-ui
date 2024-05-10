import { ClassNames } from '@emotion/react';
import { TextArea as BaseTextArea, TextAreaProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './textArea.module.scss';

const TextArea: React.FC<TextAreaProps> = ({ className, ...rest }) => {
  const { theme } = useTheme();

  return (
    <ClassNames>
      {({ css, cx }) => (
        <BaseTextArea
          {...rest}
          className={cx(styles.textArea, className, css(theme.textInput))}
        />
      )}
    </ClassNames>
  );
};

export default TextArea;
