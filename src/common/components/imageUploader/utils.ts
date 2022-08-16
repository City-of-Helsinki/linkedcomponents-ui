/* eslint-disable @typescript-eslint/no-explicit-any */
import imageCompression from 'browser-image-compression';
import { PixelCrop } from 'react-image-crop';

import {
  COMPRESSABLE_IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_IMAGE_WIDTH,
} from '../../../constants';
import isTestEnv from '../../../utils/isTestEnv';

const TO_RADIANS = Math.PI / 180;

const toBlob = (
  canvas: HTMLCanvasElement,
  type?: string,
  quality?: any
): Promise<Blob | null> =>
  new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });

const canvasPreview = (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) => {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;
  // const pixelRatio = 1

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
};

export const getCroppedImageFile = async (
  image: HTMLImageElement,
  crop: PixelCrop,
  file: File,
  scale = 1,
  rotate = 0
): Promise<File> => {
  try {
    if (!isTestEnv) {
      const canvas = document.createElement('canvas');
      canvasPreview(image, canvas, crop, scale, rotate);

      const blob = await toBlob(canvas, file.type);

      return blob ? new File([blob], file.name, { type: file.type }) : file;
    } else {
      return file;
    }
  } catch (e) {
    return file;
  }
};

export const getCompressedImageFile = async (file: File) => {
  try {
    if (!isTestEnv && COMPRESSABLE_IMAGE_TYPES.includes(file.type)) {
      const blob = await imageCompression(file, {
        maxSizeMB: MAX_IMAGE_SIZE_MB,
        maxWidthOrHeight: MAX_IMAGE_WIDTH,
      });

      return new File([blob], file.name, { type: file.type });
    }
    return file;
  } catch (e) {
    return file;
  }
};
