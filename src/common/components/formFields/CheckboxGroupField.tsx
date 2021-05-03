import classNames from 'classnames';
import { ErrorMessage, FieldProps } from 'formik';
import { CheckboxProps, IconAngleDown, IconAngleUp } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import Button from '../button/Button';
import Checkbox from '../checkbox/Checkbox';
import styles from './checkboxGroupField.module.scss';

type Columns = 1 | 2 | 3 | 4;

type Props = {
  columns: Columns;
  id?: string;
  min: number;
  options: OptionType[];
  visibleOptionAmount?: number;
} & FieldProps &
  CheckboxProps;

const CheckboxGroupField: React.FC<Props> = ({
  columns = 2,
  disabled,
  field: { name, value, ...field },
  form,
  id,
  min = 0,
  options,
  visibleOptionAmount,
  ...rest
}) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = React.useState(false);

  const visibleOptions = [...options].slice(
    0,
    showAll ? undefined : visibleOptionAmount
  );

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <>
      <div
        id={id}
        className={classNames(
          styles.checkboxsWrapper,
          styles[`columns${columns}`]
        )}
      >
        {visibleOptions.map((option, index) => {
          const checked = value.includes(option.value);

          return (
            <Checkbox
              key={index}
              {...rest}
              {...field}
              id={`${name}-${option.value}`}
              name={name}
              checked={value.includes(option.value)}
              disabled={disabled || (checked && value.length <= min)}
              value={option.value}
              label={option.label}
            />
          );
        })}
      </div>
      <ErrorMessage name={id || name}>
        {(error) => <div className={styles.errorText}>{t(error)}</div>}
      </ErrorMessage>
      {visibleOptionAmount && (
        <div className={styles.buttonWrapper}>
          <Button
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
