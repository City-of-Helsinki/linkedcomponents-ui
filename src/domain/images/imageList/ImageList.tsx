import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import { testIds } from '../../../constants';
import { ImagesQuery, useImagesQuery } from '../../../generated/graphql';
import useCommonListProps from '../../../hooks/useCommonListProps';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import { CommonListProps } from '../../../types';
import getValue from '../../../utils/getValue';
import { scrollToItem } from '../../../utils/scrollToItem';
import AdminSearchRow from '../../admin/layout/adminSearchRow/AdminSearchRow';
import { getImageItemId } from '../../image/utils';
import {
  DEFAULT_IMAGE_SORT,
  IMAGE_SORT_OPTIONS,
  IMAGES_PAGE_SIZE,
} from '../constants';
import useImageSortOptions from '../hooks/useImageSortOptions';
import ImagesTable from '../imagesTable/ImagesTable';
import { ImagesLocationState } from '../types';
import { getImageSearchInitialValues, getImagesQueryVariables } from '../utils';

type ImageListProps = {
  images: ImagesQuery['images']['data'];
  page: number;
  sort: IMAGE_SORT_OPTIONS;
} & CommonListProps;

const ImageList: React.FC<ImageListProps> = ({
  images,
  onPageChange,
  onSortChange,
  page,
  pageCount,
  pageHref,
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
      // Clear imageId value to keep scroll position correctly
      const state = omit(locationState, 'imageId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ImagesTable
        caption={getTableCaption()}
        images={images}
        setSort={onSortChange}
        sort={sort as IMAGE_SORT_OPTIONS}
      />
      {pageCount > 1 && (
        <Pagination
          pageCount={pageCount}
          pageHref={pageHref}
          pageIndex={page - 1}
          onChange={onPageChange}
        />
      )}
    </div>
  );
};

const ImageListContainer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { page, sort, text } = getImageSearchInitialValues(location.search);
  const [search, setSearch] = React.useState(text);

  const imageListId = useIdWithPrefix({ prefix: 'image-list-' });

  const { data: imagesData, loading } = useImagesQuery({
    variables: getImagesQueryVariables(location.search),
  });

  const images = getValue(imagesData?.images?.data, []);
  const { count, onSearchSubmit, ...listProps } = useCommonListProps({
    defaultSort: DEFAULT_IMAGE_SORT,
    listId: imageListId,
    meta: imagesData?.images?.meta,
    pageSize: IMAGES_PAGE_SIZE,
  });

  return (
    <div id={imageListId} data-testid={testIds.imageList.resultList}>
      <AdminSearchRow
        countText={t('imagesPage.count', { count })}
        onSearchChange={setSearch}
        onSearchSubmit={onSearchSubmit}
        searchInputLabel={t('imagesPage.labelSearch')}
        searchValue={search}
      />

      <LoadingSpinner isLoading={loading}>
        <ImageList images={images} page={page} sort={sort} {...listProps} />
      </LoadingSpinner>
    </div>
  );
};

export default ImageListContainer;
