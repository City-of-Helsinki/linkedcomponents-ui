import { useField } from 'formik';
import isNil from 'lodash/isNil';
import { useTranslation } from 'react-i18next';

import { getErrorText } from '../../../../utils/validationUtils';

type UseCommonTextInputPropsState = {
  charsLeftText: string | undefined;
  errorText: string;
};

type Props = {
  maxLength?: number;
  name: string;
  value: string;
};
const useCommonTextInputProps = ({
  maxLength,
  name,
  value,
}: Props): UseCommonTextInputPropsState => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  const charsLeft = !isNil(maxLength) ? maxLength - value.length : undefined;
  const charsLeftText = !isNil(charsLeft)
    ? t('form.validation.string.charsLeft', { count: charsLeft })
    : undefined;

  return { errorText, charsLeftText };
};

export default useCommonTextInputProps;
