import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useSignupPriceGroupOptions from '../hooks/useSignupPriceGroupOptions';
import { SignupFormFields } from '../types';
import { calculateTotalPrice } from '../utils';
import styles from './totalPrice.module.scss';

export type TotalPriceProps = {
  registration: RegistrationFieldsFragment;
  signups: SignupFormFields[];
};

const TotalPrice: FC<TotalPriceProps> = ({ registration, signups }) => {
  const { t } = useTranslation();
  const priceGroupOptions = useSignupPriceGroupOptions(registration);
  const sum = calculateTotalPrice(priceGroupOptions, signups);

  return priceGroupOptions.length ? (
    <div className={styles.totalPrice}>
      <strong>
        {t('common.total')} {sum.toFixed(2).replace('.', ',')} €
      </strong>
    </div>
  ) : null;
};

export default TotalPrice;
