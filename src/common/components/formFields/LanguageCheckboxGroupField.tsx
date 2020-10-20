import { FieldProps } from 'formik';
import { Checkbox, CheckboxProps, IconAngleDown, IconAngleUp } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { t } from 'testcafe';

import { OptionType } from '../../../types';
import Button from '../button/Button';
import styles from './languageCheckboxGroupField.module.scss';

type Props = {
  options: OptionType[];
  visibleOptionAmount?: number;
} & FieldProps &
  CheckboxProps;

const LanguageCheckboxGroupField: React.FC<Props> = ({
  field: { name, value, ...field },
  form,
  options,
  visibleOptionAmount,
  ...rest
}) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = React.useState(false);

  const visibleOptions = [...options].slice(
    0,
    showAll ? -1 : visibleOptionAmount
  );

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <>
      <div className={styles.checkboxsWrapper}>
        {visibleOptions.map((option, index) => {
          const checked = value.includes(option.value);
          const disabled = checked && value.length === 1;

          return (
            <Checkbox
              key={index}
              {...rest}
              {...field}
              id={`${name}-${option.value}`}
              name={name}
              checked={value.includes(option.value)}
              disabled={disabled}
              value={option.value}
              label={option.label}
            />
          );
        })}
      </div>
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

export default LanguageCheckboxGroupField;
