import type { ZoomPanPinch, PositionType } from '@/types';
import type { GestureResponderEvent } from 'react-native';

export const getClientPosition = (event: GestureResponderEvent) => {
  const touch = event.nativeEvent.touches[0];

  if (!touch) return { clientX: 0, clientY: 0 };

  return { clientX: touch.pageX, clientY: touch.pageY };
};

export const getTouchDistance = (event: GestureResponderEvent) => {
  const touches = event.nativeEvent.touches;

  if (touches.length < 2) {
    return 0;
  }

  const touch1 = touches[0]!;
  const touch2 = touches[1]!;

  return Math.sqrt(
    (touch1.pageX - touch2.pageX) ** 2 + (touch1.pageY - touch2.pageY) ** 2
  );
};

export const handleTouchPanningSetup = (
  instance: ZoomPanPinch,
  event: GestureResponderEvent
): void => {
  const { positionX, positionY, scale } = instance.transformState;

  instance.isPanning = true;

  const oneFingerTouch = event.nativeEvent.touches.length === 1;

  if (oneFingerTouch) {
    const { clientX, clientY } = getClientPosition(event);

    instance.startCoords = {
      positionX: clientX / scale - positionX,
      positionY: clientY / scale - positionY,
    };
  }
};

export const getPanningClientPosition = (
  instance: ZoomPanPinch,
  pageX: number,
  pageY: number
): PositionType => {
  const { startCoords, transformState } = instance;
  const { panning } = instance.setup;
  const { lockAxisX, lockAxisY } = panning;

  if (startCoords === null) {
    return transformState;
  }

  const newX = pageX / transformState.scale - startCoords.positionX;
  const newY = pageY / transformState.scale - startCoords.positionY;

  const positionX = lockAxisX ? transformState.positionX : newX;
  const positionY = lockAxisY ? transformState.positionY : newY;

  return { positionX, positionY };
};
