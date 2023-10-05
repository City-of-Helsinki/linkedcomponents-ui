import { ClassNames } from '@emotion/react';
import { NumberInput as HdsNumberInput, NumberInputProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import getValue from '../../../utils/getValue';
import styles from './numberInput.module.scss';

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      minusStepButtonAriaLabel,
      plusStepButtonAriaLabel,
      step,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
      <ClassNames>
        {({ css, cx }) => (
          <HdsNumberInput
            crossOrigin={undefined}
            {...props}
            ref={ref}
            className={cx(className, styles.numberInput, css(theme.textEditor))}
            minusStepButtonAriaLabel={
              minusStepButtonAriaLabel ||
              getValue(t('common.numberInput.buttonDecrease'), undefined)
            }
            plusStepButtonAriaLabel={
              plusStepButtonAriaLabel ||
              getValue(t('common.numberInput.buttonIncrease'), undefined)
            }
            step={step || 1}
          />
        )}
      </ClassNames>
    );
  }
);

export default NumberInput;
