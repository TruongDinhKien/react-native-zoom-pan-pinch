import { Animation } from '@/libs';
import type { ZoomPanPinch, PositionType, EasingName } from '@/types';
import { handleSetupAnimation } from '../animation';
import { getPaddingValue } from '../bounds';
import {
  isVelocityCalculationAllowed,
  getSizeMultiplier,
  isVelocityAllowed,
  getVelocityMoveTime,
  getVelocityPosition,
} from './velocity.utils';

export function handleCalculateVelocity(
  instance: ZoomPanPinch,
  position: PositionType
): void {
  const isAllowed = isVelocityCalculationAllowed(instance);
  if (!isAllowed) {
    return;
  }

  const { lastTouchPosition, velocityTime, setup } = instance;
  const { wrapperWidth } = instance;
  const { equalToMove } = setup.velocityAnimation!;

  const now = Date.now();
  if (lastTouchPosition && velocityTime && wrapperWidth) {
    const sizeMultiplier = getSizeMultiplier(instance, equalToMove);

    const distanceX = position.positionX - lastTouchPosition.positionX;
    const distanceY = position.positionY - lastTouchPosition.positionY;
    const velocityY = distanceY / sizeMultiplier;
    const velocityX = distanceX / sizeMultiplier;
    const interval = now - velocityTime;
    const speed = distanceX * distanceX + distanceY * distanceY;
    const velocity = Math.sqrt(speed) / interval;

    instance.velocity = { velocityX, velocityY, total: velocity };
  }
  instance.lastTouchPosition = position;

  instance.velocityTime = now;
}

export function handleVelocityPanning(instance: ZoomPanPinch): void {
  const { velocity, bounds, setup } = instance;
  const { wrapperWidth, wrapperHeight } = instance;

  const isAllowed = isVelocityAllowed(instance);

  if (!isAllowed || !velocity || !bounds || !wrapperWidth || !wrapperHeight) {
    return;
  }

  const { velocityX, velocityY, total } = velocity;
  const { maxPositionX, minPositionX, maxPositionY, minPositionY } = bounds;
  const { limitToBounds, alignmentAnimation } = setup;
  const { zoomAnimation, panning } = setup;

  if (!panning || !zoomAnimation || !alignmentAnimation) return;
  const { lockAxisY, lockAxisX } = panning;
  const { easing } = zoomAnimation;
  const {
    sizeX,
    sizeY,
    velocityAlignmentTime,
    easing: alignmentAnimationType,
  } = alignmentAnimation;

  const alignAnimationTime = velocityAlignmentTime;
  const moveAnimationTime = getVelocityMoveTime(instance, total);

  const finalAnimationTime = Math.max(moveAnimationTime, alignAnimationTime);

  const paddingValueX = getPaddingValue(instance, sizeX!);
  const paddingValueY = getPaddingValue(instance, sizeY!);

  const paddingX = (paddingValueX * wrapperWidth) / 100;
  const paddingY = (paddingValueY * wrapperHeight) / 100;

  const maxTargetX = maxPositionX + paddingX;
  const minTargetX = minPositionX - paddingX;

  const maxTargetY = maxPositionY + paddingY;
  const minTargetY = minPositionY - paddingY;

  const startState = instance.transformState;

  const startTime = new Date().getTime();

  handleSetupAnimation(instance, easing, finalAnimationTime, (step: number) => {
    const { scale, positionX, positionY } = instance.transformState;
    const frameTime = new Date().getTime() - startTime;
    const animationProgress = frameTime / alignAnimationTime;
    const alignAnimation = Animation[alignmentAnimationType as EasingName];
    const alignStep = 1 - alignAnimation(Math.min(1, animationProgress));

    const customStep = 1 - step;

    const newPositionX = positionX + velocityX * customStep;
    const newPositionY = positionY + velocityY * customStep;

    const currentPositionX = getVelocityPosition(
      newPositionX,
      startState.positionX,
      positionX,
      lockAxisX!,
      limitToBounds!,
      minPositionX,
      maxPositionX,
      minTargetX,
      maxTargetX,
      alignStep
    );
    const currentPositionY = getVelocityPosition(
      newPositionY,
      startState.positionY,
      positionY,
      lockAxisY!,
      limitToBounds!,
      minPositionY,
      maxPositionY,
      minTargetY,
      maxTargetY,
      alignStep
    );

    if (positionX !== newPositionX || positionY !== newPositionY) {
      instance.setTransformState({
        scale,
        positionX: currentPositionX,
        positionY: currentPositionY,
      });
    }
  });
}
