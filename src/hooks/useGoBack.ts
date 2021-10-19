import { useHistory, useLocation } from 'react-router';

import extractLatestReturnPath from '../utils/extractLatestReturnPath';
import useLocale from './useLocale';

type UseGoBackState = () => void;

type Props<S> = {
  defaultReturnPath: string;
  state?: S;
};

function useGoBack<S>({ defaultReturnPath, state }: Props<S>): UseGoBackState {
  const { search } = useLocation();
  const history = useHistory<S>();
  const locale = useLocale();

  const goBack = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      search,
      defaultReturnPath
    );

    history.push({
      pathname: `/${locale}${returnPath}`,
      search: remainingQueryString,
      state,
    });
  };

  return goBack;
}

export default useGoBack;
