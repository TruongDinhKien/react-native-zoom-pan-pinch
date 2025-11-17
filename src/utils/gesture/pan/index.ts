import type { GestureResponderEvent } from 'react-native';

import type { ZoomPanPinch, ZoomPanPinchState } from '@/types';
import { animate, handleCancelAnimation } from '@/utils/animation';
import {
  getPaddingValue,
  getTouchBoundedPosition,
  updateBounds,
} from '@/utils/bounds';
import {
  handleCalculateVelocity,
  handleVelocityPanning,
} from '@/utils/velocity';
import {
  getClientPosition,
  getPanningClientPosition,
  handleTouchPanningSetup,
} from '../gesture.utils';
import { handleCalculateZoomPositions } from '../zoom';

export function handlePanningStart(
  instance: ZoomPanPinch,
  event: GestureResponderEvent
): void {
  const { scale } = instance.transformState;

  handleCancelAnimation(instance);
  updateBounds(instance, scale);
  handleTouchPanningSetup(instance, event);
}

export function handlePanning(
  instance: ZoomPanPinch,
  event: GestureResponderEvent
): void {
  const { startCoords, setup } = instance;
  const { sizeX, sizeY } = setup.alignmentAnimation;
  const { clientX, clientY } = getClientPosition(event);

  if (!startCoords) return;

  const { positionX, positionY } = getPanningClientPosition(
    instance,
    clientX,
    clientY
  );

  const paddingValueX = getPaddingValue(instance, sizeX);
  const paddingValueY = getPaddingValue(instance, sizeY);

  handleCalculateVelocity(instance, {
    positionX,
    positionY,
  });

  handleNewPosition(
    instance,
    positionX,
    positionY,
    paddingValueX,
    paddingValueY
  );
}

export function handlePanningEnd(instance: ZoomPanPinch): void {
  if (instance.isPanning) {
    const { velocityDisabled } = instance.setup.panning;
    const { velocity } = instance;

    instance.isPanning = false;
    instance.animate = false;
    instance.animation = null;

    const isZoomed = instance.transformState.scale > 1;

    const shouldAnimate =
      !velocityDisabled && velocity && velocity.total > 0.1 && isZoomed;

    if (shouldAnimate) {
      handleVelocityPanning(instance);
    } else {
      handleAlignToBounds(instance);
    }
  }
}

export function handleAlignToBounds(
  instance: ZoomPanPinch,
  customAnimationTime?: number
): void {
  const { scale } = instance.transformState;
  const { minScale, alignmentAnimation } = instance.setup;
  const { disabled, sizeX, sizeY, duration, easing } = alignmentAnimation;

  const isDisabled = disabled || scale < minScale || (!sizeX && !sizeY);

  if (isDisabled) return;

  const to = handlePanToBounds(instance);

  if (to) {
    animate({
      instance,
      to,
      duration: customAnimationTime ?? duration,
      easing,
    });
  }
}

export function handlePanToBounds(
  instance: ZoomPanPinch
): Omit<ZoomPanPinchState, 'previousScale'> | undefined {
  const { positionX, positionY, scale } = instance.transformState;
  const { disabled, limitToBounds, centerZoomedOut } = instance.setup;
  const { wrapperHeight, wrapperWidth } = instance;

  if (disabled || !instance.bounds) return;

  const { maxPositionX, minPositionX, maxPositionY, minPositionY } =
    instance.bounds;

  const xChanged = positionX > maxPositionX || positionX < minPositionX;
  const yChanged = positionY > maxPositionY || positionY < minPositionY;

  const touchX = positionX > maxPositionX ? wrapperWidth : 0;
  const touchY = positionY > maxPositionY ? wrapperHeight : 0;

  const zoomPosition = handleCalculateZoomPositions(
    instance,
    touchX,
    touchY,
    scale,
    instance.bounds,
    limitToBounds || centerZoomedOut
  );

  return {
    scale,
    positionX: xChanged ? zoomPosition.positionX : positionX,
    positionY: yChanged ? zoomPosition.positionY : positionY,
  };
}

export function handleNewPosition(
  instance: ZoomPanPinch,
  newPositionX: number,
  newPositionY: number,
  paddingValueX: number,
  paddingValueY: number
): void {
  const { limitToBounds } = instance.setup;
  const { wrapperComponent, bounds, transformState } = instance;
  const { scale } = transformState;

  if (
    wrapperComponent === null ||
    bounds === null ||
    (newPositionX === transformState.positionX &&
      newPositionY === transformState.positionY)
  ) {
    return;
  }

  const { positionX, positionY } = getTouchBoundedPosition(
    newPositionX,
    newPositionY,
    bounds,
    limitToBounds,
    paddingValueX,
    paddingValueY
  );

  instance.setTransformState({ scale, positionX, positionY });
}

export function isPanningStartAllowed(
  instance: ZoomPanPinch,
  event: GestureResponderEvent
): boolean {
  const { isInitialized, isPanning, setup } = instance;
  const { disabled } = setup.panning;
  const touchCount = event.nativeEvent.touches.length;
  const isAllowed =
    isInitialized && !disabled && !isPanning && touchCount === 1;

  return isAllowed;
}
