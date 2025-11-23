import type { GestureResponderEvent } from 'react-native';
import type { ZoomPanPinch } from '@/types';

import { animate, handleCancelAnimation } from '@/utils/animation';
import { updateBounds } from '@/utils/bounds/bounds.logic';
import {
  getPaddingValue,
  getTouchBoundedPosition,
} from '@/utils/bounds/bounds.utils';
import { roundNumber } from '@/utils/number';
import { getTouchDistance } from '../gesture.utils';
import { handleAlignToBounds } from '@/utils/gesture/pan';
import {
  checkZoomBounds,
  getZoomPosition,
  handleCalculateZoomPositions,
} from '@/utils/gesture/zoom';
import { getTouchCenter } from '../touch';

export function handlePinchStart(
  instance: ZoomPanPinch,
  event: GestureResponderEvent
): void {
  const distance = getTouchDistance(event);

  instance.pinchStartDistance = distance;
  instance.lastDistance = distance;
  instance.pinchStartScale = instance.transformState.scale;
  instance.isPanning = false;

  const center = getTouchCenter(event);
  instance.startCoords = center;

  handleCancelAnimation(instance);
}

export function handlePinchZoom(
  instance: ZoomPanPinch,
  event: GestureResponderEvent
): void {
  const PINCH_THRESHOLD = 2;
  const {
    contentComponent,
    pinchStartDistance,
    setup,
    startCoords,
    lastDistance,
    transformState,
  } = instance;
  const { limitToBounds, centerZoomedOut, zoomAnimation, alignmentAnimation } =
    setup;
  const { disabled, size } = zoomAnimation;

  if (!pinchStartDistance || !contentComponent) return;

  const midPoint = getTouchCenter(event);

  const currentDistance = getTouchDistance(event);
  const distanceDelta = Math.abs(currentDistance - (lastDistance ?? 0));
  const newScale = calculatePinchZoom(instance, currentDistance);
  const center = getTouchCenter(event);

  const panX = center.positionX - (startCoords?.positionX ?? 0);
  const panY = center.positionY - (startCoords?.positionY ?? 0);

  updateBounds(instance, newScale);
  const bounds = instance.bounds!;

  const isPaddingDisabled = disabled || size === 0 || centerZoomedOut;
  const isLimitedToBounds = limitToBounds && isPaddingDisabled;

  const zoomPosition = handleCalculateZoomPositions(
    instance,
    midPoint.positionX,
    midPoint.positionY,
    newScale,
    bounds,
    isLimitedToBounds
  );

  instance.pinchMidpoint = midPoint;
  instance.lastDistance = currentDistance;
  const { sizeX, sizeY } = alignmentAnimation;

  const paddingValueX = getPaddingValue(instance, sizeX);
  const paddingValueY = getPaddingValue(instance, sizeY);

  const newPositionX = zoomPosition.positionX + panX;
  const newPositionY = zoomPosition.positionY + panY;

  const { positionX, positionY } = getTouchBoundedPosition(
    newPositionX,
    newPositionY,
    bounds,
    limitToBounds,
    paddingValueX,
    paddingValueY
  );

  instance.setTransformState({
    scale: distanceDelta > PINCH_THRESHOLD ? newScale : transformState.scale,
    positionX,
    positionY,
  });
}

export function handlePinchStop(instance: ZoomPanPinch): void {
  handleAlignToScaleBounds(instance);

  instance.velocity = null;
  instance.lastDistance = null;
  instance.pinchMidpoint = null;
  instance.pinchStartScale = null;
  instance.pinchStartDistance = null;
}

export function handleAlignToScaleBounds(instance: ZoomPanPinch): void {
  const { pinchMidpoint, transformState, setup } = instance;
  const { minScale, limitToBounds, zoomAnimation } = setup;
  const { disabled, duration, easing } = zoomAnimation;
  const { scale } = transformState;

  const isDisabled = disabled || scale >= minScale;

  if (scale >= 1 || limitToBounds) {
    handleAlignToBounds(instance);
  }

  if (isDisabled || !instance.mounted) return;

  const touchX = pinchMidpoint?.positionX ?? 0;
  const touchY = pinchMidpoint?.positionY ?? 0;

  const to = getZoomPosition(instance, minScale, touchX, touchY);

  animate({ instance, to, duration, easing });
}

export const calculatePinchZoom = (
  instance: ZoomPanPinch,
  currentDistance: number
): number => {
  const { pinchStartScale, pinchStartDistance, setup } = instance;
  const { maxScale, minScale, zoomAnimation, disablePadding } = setup;
  const { size, disabled } = zoomAnimation;

  if (!pinchStartScale || pinchStartDistance === null || !currentDistance) {
    throw new Error('Pinch touches distance was not provided');
  }

  if (currentDistance < 0) {
    return instance.transformState.scale;
  }

  const touchProportion = currentDistance / pinchStartDistance;
  const scaleDifference = touchProportion * pinchStartScale;

  return checkZoomBounds(
    roundNumber(scaleDifference, 2),
    minScale,
    maxScale,
    size,
    !disabled && !disablePadding
  );
};

export function isPinchStartAllowed(
  instance: ZoomPanPinch,
  event: GestureResponderEvent
): boolean {
  const { isInitialized, setup } = instance;
  const { disabled } = setup.pinch;

  const touchCount = event.nativeEvent.touches.length;
  const isAllowed = isInitialized && !disabled && touchCount >= 2;

  return isAllowed;
}
