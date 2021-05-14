import { css } from '@emotion/css';
import classNames from 'classnames';
import { IconEye } from 'hds-react';
import xor from 'lodash/xor';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import { imagesPathBuilder } from '../../../domain/image/utils';
import { Image, ImagesQuery, useImagesQuery } from '../../../generated/graphql';
import useIsComponentFocused from '../../../hooks/useIsComponentFocused';
import getNextPage from '../../../utils/getNextPage';
import getPathBuilder from '../../../utils/getPathBuilder';
import Button from '../button/Button';
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

  const {
    data: imagesData,
    loading,
    fetchMore: fetchMoreImages,
  } = useImagesQuery({
    variables: {
      createPath: getPathBuilder(imagesPathBuilder),
      pageSize: PAGE_SIZE,
      publisher,
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

        await fetchMoreImages({
          updateQuery: (prev: ImagesQuery, { fetchMoreResult }) => {
            /* istanbul ignore next */
            if (!fetchMoreResult?.images) {
              return prev;
            }

            const prevImages = prev.images?.data;
            const newImages = fetchMoreResult.images.data;
            fetchMoreResult.images.data = [...prevImages, ...newImages];

            return fetchMoreResult;
          },
          variables: {
            page: nextPage,
          },
        });
        setLoadingMore(false);
      } catch (e) /* istanbul ignore next */ {
        setLoadingMore(false);
      }
    }
  };

  const handleChange = (image: Image) => () => {
    if (multiple) {
      onChange(xor(value, [image.atId as string]));
    } else {
      onChange(
        value.includes(image.atId as string) ? [] : [image.atId as string]
      );
    }
  };

  const handleDoubleClick = (image: Image) => () => {
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
    <div
      className={classNames(styles.imageSelector, css(theme.imageSelector))}
      ref={container}
    >
      <div className={styles.imagesGrid}>
        {imagesData?.images.data.length ? (
          imagesData?.images.data.map((image) => {
            const checked = value.includes(image?.atId as string);

            return (
              image?.url && (
                <button
                  key={image.id}
                  className={classNames(styles.image, {
                    [styles.checked]: checked,
                  })}
                  aria-label={image.name as string}
                  disabled={disabled}
                  style={{ backgroundImage: `url(${image.url})` }}
                  role="checkbox"
                  type="button"
                  aria-checked={checked}
                  onClick={handleChange(image)}
                  onDoubleClick={handleDoubleClick(image)}
                />
              )
            );
          })
        ) : (
          <div className={styles.noImages}>Ei kuvia</div>
        )}
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          disabled={disabledLoadMore}
          iconLeft={<IconEye />}
          onClick={fetchMore}
          variant="supplementary"
        >
          {t('common.showMoreWithCount', { count: imagesLeft })}
        </Button>
      </div>
    </div>
  );
};

export default ImageSelector;
