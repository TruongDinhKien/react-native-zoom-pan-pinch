import type {
  BoundsType,
  PositionType,
  StateType,
  ZoomPanPinch,
  ZoomPanPinchState,
} from '@/types';
import { calculateBounds } from '@/utils/bounds/bounds.logic';
import {
  boundLimiter,
  getTouchBoundedPosition,
} from '@/utils/bounds/bounds.utils';
import { roundNumber } from '@/utils/number';

export function handleCalculateZoomPositions(
  instance: ZoomPanPinch,
  touchX: number,
  touchY: number,
  newScale: number,
  bounds: BoundsType,
  limitToBounds?: boolean
): PositionType {
  const { scale, positionX, positionY } = instance.transformState;

  const scaleDifference = newScale - scale;
  const calculatedPositionX = positionX - touchX * scaleDifference;
  const calculatedPositionY = positionY - touchY * scaleDifference;

  const newPositions = getTouchBoundedPosition(
    calculatedPositionX,
    calculatedPositionY,
    bounds,
    limitToBounds!,
    0,
    0
  );

  return newPositions;
}

export function checkZoomBounds(
  zoom: number,
  minScale: number,
  maxScale: number,
  zoomPadding: number,
  enablePadding: boolean
): number {
  const scalePadding = enablePadding ? zoomPadding : 0;
  const minScaleWithPadding = minScale - scalePadding;

  if (!Number.isNaN(maxScale) && zoom >= maxScale) return maxScale;
  if (!Number.isNaN(minScale) && zoom <= minScaleWithPadding)
    return minScaleWithPadding;
  return zoom;
}

export const getCenterPosition = (
  scale: number,
  instance: ZoomPanPinch
): StateType => {
  const { wrapperWidth, wrapperHeight, contentWidth, contentHeight } = instance;

  const scaledContentWidth = contentWidth * scale;
  const scaledContentHeight = contentHeight * scale;

  const centerPositionX = (wrapperWidth - scaledContentWidth) / 2;
  const centerPositionY = (wrapperHeight - scaledContentHeight) / 2;

  return {
    scale,
    positionX: centerPositionX,
    positionY: centerPositionY,
  };
};

export const translateFocusToCenterOrigin = (
  instance: ZoomPanPinch,
  focusX: number,
  focusY: number
) => {
  const { wrapperWidth, wrapperHeight } = instance;

  const originX = wrapperWidth / 2;
  const originY = wrapperHeight / 2;

  return {
    shiftedFocusX: focusX - originX,
    shiftedFocusY: focusY - originY,
  };
};

export const getZoomScalePosition = (
  instance: ZoomPanPinch,
  scale: number,
  focusX: number,
  focusY: number
): StateType => {
  const { transformState, setup } = instance;

  const { shiftedFocusX, shiftedFocusY } = translateFocusToCenterOrigin(
    instance,
    focusX,
    focusY
  );

  const currentScale = transformState.scale;
  const currentPositionX = transformState.positionX;
  const currentPositionY = transformState.positionY;

  const contentFocusX = (shiftedFocusX - currentPositionX) / currentScale;
  const contentFocusY = (shiftedFocusY - currentPositionY) / currentScale;

  const newPositionX = shiftedFocusX - contentFocusX * scale;
  const newPositionY = shiftedFocusY - contentFocusY * scale;

  const updatedBounds = calculateBounds(instance, scale);
  const { minPositionX, minPositionY, maxPositionX, maxPositionY } =
    updatedBounds;

  const boundedPositionX = boundLimiter(
    newPositionX,
    minPositionX,
    maxPositionX,
    setup.limitToBounds
  );

  const boundedPositionY = boundLimiter(
    newPositionY,
    minPositionY,
    maxPositionY,
    setup.limitToBounds
  );

  return {
    scale,
    positionX: boundedPositionX,
    positionY: boundedPositionY,
  };
};
export const calculateNextScale = (
  instance: ZoomPanPinch,
  delta: number,
  step: number
) => {
  const { scale } = instance.transformState;
  const { setup, mounted } = instance;
  const { maxScale, minScale, zoomAnimation, smooth } = setup;
  const { size } = zoomAnimation;

  if (!mounted) {
    throw new Error('Wrapper is not mounted');
  }

  const targetScale = smooth
    ? scale * Math.exp(delta * step)
    : scale + delta * step;

  const newScale = checkZoomBounds(
    roundNumber(targetScale, 3),
    minScale,
    maxScale,
    size,
    false
  );
  return newScale;
};

export function getZoomPosition(
  instance: ZoomPanPinch,
  scale: number,
  touchX: number,
  touchY: number
): Omit<ZoomPanPinchState, 'previousScale'> {
  const { minScale, maxScale, limitToBounds } = instance.setup;

  const newScale = checkZoomBounds(
    roundNumber(scale, 2),
    minScale,
    maxScale,
    0,
    false
  );
  const bounds = calculateBounds(instance, newScale);

  const { positionX, positionY } = handleCalculateZoomPositions(
    instance,
    touchX,
    touchY,
    newScale,
    bounds,
    limitToBounds
  );

  return { scale: newScale, positionX, positionY };
}
