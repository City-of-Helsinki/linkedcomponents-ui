import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { scroller } from 'react-scroll';

import { MetaFieldsFragment } from '../generated/graphql';
import { CommonListProps } from '../types';
import getPageCount from '../utils/getPageCount';
import replaceParamsToQueryString from '../utils/replaceParamsToQueryString';

type UseCommonListPropsState = {
  count: number;
  onSearchSubmit: (search: string) => void;
} & CommonListProps;

type Props = {
  defaultSort: string;
  listId: string;
  meta: MetaFieldsFragment | undefined;
  pagePath?: string;
  pageSize: number;
};

const useCommonListProps = ({
  defaultSort,
  listId,
  meta,
  pagePath = 'page',
  pageSize,
}: Props): UseCommonListPropsState => {
  const location = useLocation();
  const navigate = useNavigate();

  const replaceQueryParams = (queryParams: Record<string, unknown>) => {
    return replaceParamsToQueryString(
      location.search,
      queryParams,
      ({ value }) => value
    );
  };

  const onPageChange = (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    event.preventDefault();

    const pageNumber = index + 1;
    navigate({
      pathname: location.pathname,
      search: replaceQueryParams({
        [pagePath]: pageNumber > 1 ? pageNumber : null,
      }),
    });

    // Scroll to the beginning of the list
    scroller.scrollTo(listId, { offset: -100 });
  };

  const onSearchSubmit = (text: string) => {
    navigate({
      pathname: location.pathname,
      search: replaceQueryParams({ page: null, text }),
    });
  };

  const onSortChange = (sort: string) => {
    navigate({
      pathname: location.pathname,
      search: replaceQueryParams({ sort: sort !== defaultSort ? sort : null }),
    });
  };

  const pageHref = (index: number) => {
    const searchQuery = replaceQueryParams({ page: index > 1 ? index : null });

    return `${location.pathname}${searchQuery}`;
  };

  const count = meta?.count ?? 0;
  const pageCount = getPageCount(count, pageSize);

  return {
    count,
    onPageChange,
    onSortChange,
    onSearchSubmit,
    pageCount,
    pageHref,
  };
};

export default useCommonListProps;
