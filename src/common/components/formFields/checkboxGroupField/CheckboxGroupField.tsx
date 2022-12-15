import classNames from 'classnames';
import { FieldProps, useField } from 'formik';
import { IconAngleDown, IconAngleUp } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../../types';
import { getErrorText } from '../../../../utils/validationUtils';
import Button from '../../button/Button';
import Checkbox from '../../checkbox/Checkbox';
import { RequiredIndicator } from '../../requiredIndicator/RequiredIndicator';
import styles from './checkboxGroupField.module.scss';

type Columns = 1 | 2 | 3 | 4;

type Props = React.PropsWithChildren<
  {
    className?: string;
    columns: Columns;
    disabledOptions: string[];
    errorName?: string;
    label?: string;
    min: number;
    options: OptionType[];
    required?: boolean;
    visibleOptionAmount?: number;
  } & FieldProps &
    React.HTMLProps<HTMLFieldSetElement>
>;

const CheckboxGroupField: React.FC<Props> = ({
  className,
  columns = 2,
  disabled,
  disabledOptions,
  field: { name, onBlur, value, ...field },
  form,
  errorName,
  label,
  min = 0,
  options,
  required,
  visibleOptionAmount,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { error, touched: touchedError }] = useField(errorName || name);
  const [, { touched }] = useField(name);

  const errorText = getErrorText(error, touched || touchedError, t);
  const [showAll, setShowAll] = React.useState(false);

  const visibleOptions = [...options].slice(
    0,
    showAll ? undefined : visibleOptionAmount
  );

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  return (
    <>
      <fieldset
        className={classNames(styles.checkboxGroup, className)}
        {...rest}
      >
        <legend className={styles.label}>
          {label} {required && <RequiredIndicator />}
        </legend>
        <div
          id={errorName || name}
          className={classNames(
            styles.checkboxsWrapper,
            styles[`columns${columns}`]
          )}
        >
          {visibleOptions.map((option, index) => {
            const checked = value?.includes(option.value);

            return (
              <Checkbox
                key={index}
                {...field}
                id={`${name}-${option.value}`}
                name={name}
                checked={checked}
                disabled={
                  disabled ||
                  (checked && value.length <= min) ||
                  disabledOptions?.includes(option.value)
                }
                onBlur={handleBlur}
                value={option.value}
                label={option.label}
              />
            );
          })}
        </div>
        {errorText && <div className={styles.errorText}>{errorText}</div>}
      </fieldset>
      {visibleOptionAmount && options.length > visibleOptionAmount && (
        <div className={styles.buttonWrapper}>
          <Button
            disabled={disabled}
            fullWidth={true}
            iconLeft={showAll ? <IconAngleUp /> : <IconAngleDown />}
            onClick={toggleShowAll}
            variant="supplementary"
          >
            {showAll ? t('common.showLess') : t('common.showMore')}
          </Button>
        </div>
      )}
    </>
  );
};

export default CheckboxGroupField;
