import { useEffect } from 'react';
import { Maybe } from 'yup';

import useMountedState from './useMountedState';

const testShouldShowPlaceholder = (
  url: string,
  cb: (success: boolean) => void
) => {
  const img = new Image();
  img.src = url;

  img.onload = () => cb(false);
  img.onerror = () => cb(true);
};

const useShowPlaceholderImage = (url: Maybe<string>) => {
  const [showPlaceholderImage, setShowPlaceholderImage] =
    useMountedState(false);

  useEffect(() => {
    if (url) {
      testShouldShowPlaceholder(url, setShowPlaceholderImage);
    }
  }, [setShowPlaceholderImage, url]);

  return !url || showPlaceholderImage;
};

export default useShowPlaceholderImage;
