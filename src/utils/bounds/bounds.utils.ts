import type { BoundsType, PositionType, ZoomPanPinch } from '@/types';
import { roundNumber } from '../number';

export const getBounds = (
  wrapperWidth: number,
  newContentWidth: number,
  diffWidth: number,
  wrapperHeight: number,
  newContentHeight: number,
  diffHeight: number,
  centerZoomedOut?: boolean
): BoundsType => {
  const halfExtraWidth = diffWidth / 2;
  const halfExtraHeight = diffHeight / 2;

  let minPositionX = -halfExtraWidth;
  let maxPositionX = halfExtraWidth;
  let minPositionY = -halfExtraHeight;
  let maxPositionY = halfExtraHeight;
  const factor = centerZoomedOut ? 0 : 1;

  if (newContentWidth < wrapperWidth) {
    minPositionX = +(halfExtraWidth * factor);
    maxPositionX = -(halfExtraWidth * factor);
  }

  if (newContentHeight < wrapperHeight) {
    minPositionY = +(halfExtraHeight * factor);
    maxPositionY = -(halfExtraHeight * factor);
  }

  return { minPositionX, maxPositionX, minPositionY, maxPositionY };
};

export function getTouchBoundedPosition(
  touchX: number,
  touchY: number,
  bounds: BoundsType,
  limitToBounds: boolean,
  paddingValueX: number,
  paddingValueY: number
): PositionType {
  const { minPositionX, minPositionY, maxPositionX, maxPositionY } = bounds;

  const positionX = boundLimiter(
    touchX,
    minPositionX - paddingValueX,
    maxPositionX + paddingValueX,
    limitToBounds
  );

  const positionY = boundLimiter(
    touchY,
    minPositionY - paddingValueY,
    maxPositionY + paddingValueY,
    limitToBounds
  );
  return { positionX, positionY };
}

export const boundLimiter = (
  value: number,
  minBound: number,
  maxBound: number,
  isActive: boolean
): number => {
  if (!isActive) return roundNumber(value, 2);
  if (value < minBound) return roundNumber(minBound, 2);
  if (value > maxBound) return roundNumber(maxBound, 2);
  return roundNumber(value, 2);
};

export const getPaddingValue = (instance: ZoomPanPinch, size: number) => {
  const { setup, transformState } = instance;
  const { scale } = transformState;
  const { minScale, disablePadding } = setup;
  if (size > 0 && scale >= minScale && !disablePadding) {
    return size;
  }

  return 0;
};
