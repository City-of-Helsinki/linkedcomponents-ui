import { useLocation, useNavigate } from 'react-router';

import { replaceParamsToAdminListQueryString } from '../utils/adminListQueryStringUtils';
import useLocale from './useLocale';

const useResetPageParamAndGoToPage = () => {
  const locale = useLocale();
  const { search } = useLocation();
  const navigate = useNavigate();

  const resetPageParamAndGoToPage = (route: string) => {
    const queryString = replaceParamsToAdminListQueryString(search, {
      page: null,
    });

    navigate({
      pathname: `/${locale}${route}`,
      search: queryString,
    });
  };

  return { resetPageParamAndGoToPage };
};

export default useResetPageParamAndGoToPage;
