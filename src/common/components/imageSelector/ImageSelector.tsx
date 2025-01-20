import { ClassNames } from '@emotion/react';
import { ButtonVariant, IconEye, IconPhoto, IconSize } from 'hds-react';
import xor from 'lodash/xor';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

import { COMBOBOX_DEBOUNCE_TIME_MS, testIds } from '../../../constants';
import { useTheme } from '../../../domain/app/theme/Theme';
import { imagesPathBuilder } from '../../../domain/image/utils';
import useUser from '../../../domain/user/hooks/useUser';
import {
  Image,
  ImageFieldsFragment,
  useImagesQuery,
} from '../../../generated/graphql';
import useIsComponentFocused from '../../../hooks/useIsComponentFocused';
import useMountedState from '../../../hooks/useMountedState';
import useShowPlaceholderImage from '../../../hooks/useShowPlaceholderImage';
import getNextPage from '../../../utils/getNextPage';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import Button from '../button/Button';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import SearchInput from '../searchInput/SearchInput';
import { PAGE_SIZE } from './constants';
import styles from './imageSelector.module.scss';

export interface ImageSelectorProps {
  disabled?: boolean;
  multiple?: boolean;
  onBlur?: (value: string[]) => void;
  onChange: (value: string[]) => void;
  onDoubleClick?: (image: Image) => void;
  publisher: string;
  value: string[];
}

export type ImageItemProps = {
  checked: boolean;
  disabled: boolean;
  image: ImageFieldsFragment;
  onClick: (image: ImageFieldsFragment) => void;
  onDoubleClick: (image: ImageFieldsFragment) => void;
};

export const ImageItem: React.FC<ImageItemProps> = ({
  checked,
  disabled,
  image,
  onClick,
  onDoubleClick,
}) => {
  const url = useMemo(() => getValue(image.url, ''), [image]);
  const showPlaceholder = useShowPlaceholderImage(url);

  return (
    <ClassNames>
      {({ cx }) => (
        <button
          className={cx(styles.image, {
            [styles.checked]: checked,
            [styles.showPlaceholder]: showPlaceholder,
          })}
          aria-label={getValue(image.name, '')}
          disabled={disabled}
          data-testid={`${testIds.imageSelector.imageItem}-${image.id}`}
          style={{ backgroundImage: `url(${url})` }}
          role="checkbox"
          type="button"
          aria-checked={checked}
          onClick={() => onClick(image)}
          onDoubleClick={() => onDoubleClick(image)}
        >
          {showPlaceholder && <IconPhoto size={IconSize.ExtraLarge} />}
        </button>
      )}
    </ClassNames>
  );
};

const ImageSelector: React.FC<ImageSelectorProps> = ({
  disabled = false,
  multiple = false,
  onBlur,
  onChange,
  onDoubleClick,
  publisher,
  value,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const container = React.useRef<HTMLDivElement | null>(null);
  const [loadingMore, setLoadingMore] = React.useState(false);

  const isComponentFocused = useIsComponentFocused(container);

  const [search, setSearch] = useMountedState('');
  const [debouncedSearch] = useDebounce(search, COMBOBOX_DEBOUNCE_TIME_MS);

  const { externalUser, loading: loadingUser } = useUser();
  const isExternalUser = !loadingUser && externalUser;

  const {
    data: imagesData,
    loading,
    fetchMore: fetchMoreImages,
  } = useImagesQuery({
    variables: {
      createdBy: isExternalUser ? 'me' : undefined,
      createPath: getPathBuilder(imagesPathBuilder),
      mergePages: true,
      pageSize: PAGE_SIZE,
      publisher: isExternalUser ? '' : publisher,
      text: debouncedSearch,
    },
  });

  const nextPage: number | null = React.useMemo(() => {
    const meta = imagesData?.images.meta;
    return meta ? getNextPage(meta) : null;
  }, [imagesData]);

  const fetchMore = async () => {
    /* istanbul ignore else  */
    if (nextPage) {
      try {
        setLoadingMore(true);

        await fetchMoreImages({ variables: { page: nextPage } });

        setLoadingMore(false);
      } catch (e) /* istanbul ignore next */ {
        setLoadingMore(false);
      }
    }
  };

  const handleChange = (image: Image) => {
    if (multiple) {
      onChange(xor(value, [image.atId]));
    } else {
      onChange(value.includes(image.atId) ? [] : [image.atId]);
    }
  };

  const handleDoubleClick = (image: Image) => {
    onDoubleClick && onDoubleClick(image);
  };

  const imagesLeft = imagesData
    ? imagesData?.images.meta.count - imagesData?.images.data.length
    : 0;

  const handleDocumentFocusin = () => {
    if (!isComponentFocused()) {
      onBlur && onBlur(value);
    }
  };

  React.useEffect(() => {
    document.addEventListener('focusin', handleDocumentFocusin);

    return () => {
      document.removeEventListener('focusin', handleDocumentFocusin);
    };
  });

  const disabledLoadMore = disabled || !imagesLeft || loading || loadingMore;

  return (
    <ClassNames>
      {({ css, cx }) => (
        <div
          className={cx(styles.imageSelector, css(theme.imageSelector))}
          ref={container}
        >
          <div className={styles.searchInputRow}>
            <SearchInput
              hideLabel
              label={t('common.imageSelector.labelSearch')}
              onChange={setSearch}
              onSubmit={setSearch}
              placeholder={t('common.imageSelector.labelSearch')}
              value={search}
            />
          </div>
          <div className={styles.imagesGrid}>
            {imagesData?.images.data.length ? (
              imagesData?.images.data.filter(skipFalsyType).map((image) => {
                const checked = value.includes(image?.atId);

                return (
                  <ImageItem
                    key={image.atId}
                    checked={checked}
                    disabled={disabled}
                    image={image}
                    onClick={handleChange}
                    onDoubleClick={handleDoubleClick}
                  />
                );
              })
            ) : (
              <div className={styles.noImages}>
                <LoadingSpinner isLoading={loading}>Ei kuvia</LoadingSpinner>
              </div>
            )}
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              disabled={disabledLoadMore}
              iconStart={<IconEye />}
              onClick={fetchMore}
              variant={ButtonVariant.Supplementary}
            >
              {t('common.showMoreWithCount', { count: imagesLeft })}
            </Button>
          </div>
        </div>
      )}
    </ClassNames>
  );
};

export default ImageSelector;
