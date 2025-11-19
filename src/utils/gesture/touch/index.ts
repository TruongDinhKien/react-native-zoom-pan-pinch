import type { PositionType } from '@/types';
import type { GestureResponderEvent } from 'react-native';

export const getTouchCenter = (event: GestureResponderEvent): PositionType => {
  const { touches } = event.nativeEvent;

  if (touches.length < 2) {
    return { positionX: 0, positionY: 0 };
  }

  const firstTouch = touches[0]!;
  const secondTouch = touches[1]!;

  const positionX = (firstTouch.pageX + secondTouch.pageX) / 2;
  const positionY = (firstTouch.pageY + secondTouch.pageY) / 2;

  return {
    positionX,
    positionY,
  };
};
