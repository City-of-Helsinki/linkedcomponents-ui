import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { scroller } from 'react-scroll';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import SearchInput from '../../../common/components/searchInput/SearchInput';
import TableWrapper from '../../../common/components/table/tableWrapper/TableWrapper';
import { testIds } from '../../../constants';
import { ImagesQuery, useImagesQuery } from '../../../generated/graphql';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import getPageCount from '../../../utils/getPageCount';
import { scrollToItem } from '../../../utils/scrollToItem';
import { getImageItemId } from '../../image/utils';
import {
  DEFAULT_IMAGE_SORT,
  IMAGE_SORT_OPTIONS,
  IMAGES_PAGE_SIZE,
} from '../constants';
import useImageSortOptions from '../hooks/useImageSortOptions';
import ImagesTable from '../imagesTable/ImagesTable';
import { ImagesLocationState } from '../types';
import {
  getImageSearchInitialValues,
  getImagesQueryVariables,
  replaceParamsToImageQueryString,
} from '../utils';
import styles from './imageList.module.scss';

type ImageListProps = {
  images: ImagesQuery['images']['data'];
  onPageChange: (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => void;
  onSortChange: (sort: IMAGE_SORT_OPTIONS) => void;
  page: number;
  pageCount: number;
  sort: IMAGE_SORT_OPTIONS;
};

const ImageList: React.FC<ImageListProps> = ({
  images,
  onPageChange,
  onSortChange,
  page,
  pageCount,
  sort,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const sortOptions = useImageSortOptions();

  const getTableCaption = () => {
    return t(`imagesPage.imagesTableCaption`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  React.useEffect(() => {
    const locationState = location.state as ImagesLocationState;
    if (locationState?.imageId) {
      scrollToItem(getImageItemId(locationState.imageId));
      // Clear keywordId value to keep scroll position correctly
      const state = omit(locationState, 'imageId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <TableWrapper>
        <ImagesTable
          caption={getTableCaption()}
          images={images}
          setSort={onSortChange}
          sort={sort as IMAGE_SORT_OPTIONS}
        />
      </TableWrapper>
      {pageCount > 1 && (
        <Pagination
          pageCount={pageCount}
          pageHref={(index: number) => {
            return `${location.pathname}${replaceParamsToImageQueryString(
              location.search,
              { page: index > 1 ? index : null }
            )}`;
          }}
          pageIndex={page - 1}
          onChange={onPageChange}
        />
      )}
    </div>
  );
};

const ImageListContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { page, sort, text } = getImageSearchInitialValues(location.search);
  const [search, setSearch] = React.useState(text);

  const imageListId = useIdWithPrefix({ prefix: 'image-list-' });

  const handlePageChange = (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    event.preventDefault();

    const pageNumber = index + 1;
    navigate({
      pathname: location.pathname,
      search: replaceParamsToImageQueryString(location.search, {
        page: pageNumber > 1 ? pageNumber : null,
      }),
    });
    // Scroll to the beginning of keyword list
    scroller.scrollTo(imageListId, { offset: -100 });
  };

  const handleSearchChange = (text: string) => {
    navigate({
      pathname: location.pathname,
      search: replaceParamsToImageQueryString(location.search, {
        page: null,
        text,
      }),
    });
  };

  const handleSortChange = (val: IMAGE_SORT_OPTIONS) => {
    navigate({
      pathname: location.pathname,
      search: replaceParamsToImageQueryString(location.search, {
        sort:
          val !== DEFAULT_IMAGE_SORT ? val : /* istanbul ignore next */ null,
      }),
    });
  };

  const { data: imagesData, loading } = useImagesQuery({
    variables: getImagesQueryVariables(location.search),
  });

  /* istanbul ignore next */
  const images = imagesData?.images?.data || [];
  /* istanbul ignore next */
  const keywordsCount = imagesData?.images?.meta.count || 0;
  const pageCount = getPageCount(keywordsCount, IMAGES_PAGE_SIZE);

  return (
    <div id={imageListId} data-testid={testIds.imageList.resultList}>
      <div className={styles.searchRow}>
        <span className={styles.count}>
          {t('imagesPage.count', { count: keywordsCount })}
        </span>
        <SearchInput
          className={styles.searchInput}
          label={t('imagesPage.labelSearch')}
          hideLabel
          onSubmit={handleSearchChange}
          onChange={setSearch}
          value={search}
        />
      </div>

      <LoadingSpinner isLoading={loading}>
        <ImageList
          images={images}
          onPageChange={handlePageChange}
          onSortChange={handleSortChange}
          page={page}
          pageCount={pageCount}
          sort={sort}
        />
      </LoadingSpinner>
    </div>
  );
};

export default ImageListContainer;
