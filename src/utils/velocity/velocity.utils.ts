import type { ZoomPanPinch } from '@/types';
import { boundLimiter } from '../bounds';

export function isVelocityCalculationAllowed(instance: ZoomPanPinch): boolean {
  const { mounted } = instance;
  const { disabled, velocityAnimation } = instance.setup;
  const { scale } = instance.transformState;
  const { disabled: disabledVelocity } = velocityAnimation!;
  const isAllowed = !disabledVelocity || scale > 1 || !disabled || mounted;

  return isAllowed;
}

export function isVelocityAllowed(instance: ZoomPanPinch): boolean {
  const { mounted, velocity, bounds } = instance;
  const { disabled, velocityAnimation } = instance.setup;
  const { scale } = instance.transformState;
  const { disabled: disabledVelocity } = velocityAnimation!;

  const isAllowed = !disabledVelocity || scale > 1 || !disabled || mounted;

  if (!isAllowed) return false;
  if (!velocity || !bounds) return false;

  return true;
}

export function getVelocityMoveTime(
  instance: ZoomPanPinch,
  velocity: number
): number {
  const { velocityAnimation } = instance.setup;
  const { equalToMove, duration, sensitivity } = velocityAnimation!;

  if (equalToMove) {
    return duration * velocity * sensitivity!;
  }
  return duration;
}

export function getVelocityPosition(
  newPosition: number,
  startPosition: number,
  currentPosition: number,
  isLocked: boolean,
  limitToBounds: boolean,
  minPosition: number,
  maxPosition: number,
  minTarget: number,
  maxTarget: number,
  step: number
): number {
  if (limitToBounds) {
    if (startPosition > maxPosition && currentPosition > maxPosition) {
      const calculatedPosition =
        maxPosition + (newPosition - maxPosition) * step;

      if (calculatedPosition > maxTarget) return maxTarget;
      if (calculatedPosition < maxPosition) return maxPosition;
      return calculatedPosition;
    }
    if (startPosition < minPosition && currentPosition < minPosition) {
      const calculatedPosition =
        minPosition + (newPosition - minPosition) * step;
      if (calculatedPosition < minTarget) return minTarget;
      if (calculatedPosition > minPosition) return minPosition;
      return calculatedPosition;
    }
  }
  if (isLocked) return startPosition;
  return boundLimiter(newPosition, minPosition, maxPosition, limitToBounds);
}

export function getSizeMultiplier(
  instance: ZoomPanPinch,
  equalToMove: boolean
): number {
  const currentScale = instance.transformState.scale || 1;
  if (equalToMove) {
    return currentScale;
  }

  const multiplier = 1 + currentScale / 5;

  return multiplier;
}
