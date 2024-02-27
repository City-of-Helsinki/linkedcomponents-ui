import useServerErrors from '../../../hooks/useServerErrors';
import { UseServerErrorsState } from '../../../types';
import { parsePriceGroupServerErrors } from './utils';

const usePriceGroupServerErrors = (): UseServerErrorsState => {
  return useServerErrors(parsePriceGroupServerErrors);
};

export default usePriceGroupServerErrors;
