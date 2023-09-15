import { ClassNames } from '@emotion/react';
import { PhoneInput as BasePhoneInput, PhoneInputProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const PhoneInput: React.FC<PhoneInputProps> = ({ className, ...rest }) => {
  const { theme } = useTheme();

  return (
    <ClassNames>
      {({ css, cx }) => (
        <BasePhoneInput
          crossOrigin={undefined}
          {...rest}
          className={cx(className, css(theme.textInput))}
        />
      )}
    </ClassNames>
  );
};

export default PhoneInput;
