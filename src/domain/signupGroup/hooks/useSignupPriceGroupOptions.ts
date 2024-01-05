import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getLocalisedString from '../../../utils/getLocalisedString';
import getValue from '../../../utils/getValue';
import { SignupPriceGroupOption } from '../types';

const useSignupPriceGroupOptions = (
  registration: RegistrationFieldsFragment
): SignupPriceGroupOption[] => {
  const locale = useLocale();

  return (
    registration.registrationPriceGroups?.map((pg) => {
      const price = pg?.price ? Number(pg.price) : 0;

      return {
        label: [
          `${getLocalisedString(pg?.priceGroup?.description, locale)}`,
          `${price.toFixed(2).replace('.', ',')} €`,
        ].join(' '),
        price,
        value: getValue(pg?.id?.toString(), ''),
      };
    }) ?? []
  );
};

export default useSignupPriceGroupOptions;
