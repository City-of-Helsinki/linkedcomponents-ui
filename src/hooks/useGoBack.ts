import { useLocation, useNavigate } from 'react-router';

import extractLatestReturnPath from '../utils/extractLatestReturnPath';
import useLocale from './useLocale';

type UseGoBackState = () => void;

type Props<S> = {
  defaultReturnPath: string;
  state?: S;
};

function useGoBack<S>({ defaultReturnPath, state }: Props<S>): UseGoBackState {
  const { search } = useLocation();
  const navigate = useNavigate();
  const locale = useLocale();

  const goBack = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      search,
      defaultReturnPath
    );

    navigate(
      {
        pathname: `/${locale}${returnPath}`,
        search: remainingQueryString,
      },
      { state }
    );
  };

  return goBack;
}

export default useGoBack;
