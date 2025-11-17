import type { BoundsType, ZoomPanPinch } from '@/types';
import { getBounds } from './bounds.utils';

export const updateBounds = (instance: ZoomPanPinch, newScale: number) => {
  instance.bounds = calculateBounds(instance, newScale);
};

export const calculateBounds = (
  instance: ZoomPanPinch,
  newScale: number
): BoundsType => {
  if (!instance.wrapperWidth || !instance.contentWidth) {
    throw new Error('Components dimensions are zero (onLayout not finished)');
  }
  const { wrapperWidth, wrapperHeight, contentWidth, contentHeight } = instance;

  const newContentWidth = contentWidth * newScale;
  const newContentHeight = contentHeight * newScale;
  const newDiffWidth = (newContentWidth - wrapperWidth) / newScale;
  const newDiffHeight = (newContentHeight - wrapperHeight) / newScale;

  const bounds = getBounds(
    wrapperWidth,
    newContentWidth,
    newDiffWidth,
    wrapperHeight,
    newContentHeight,
    newDiffHeight,
    instance.setup.centerZoomedOut
  );

  return bounds;
};
