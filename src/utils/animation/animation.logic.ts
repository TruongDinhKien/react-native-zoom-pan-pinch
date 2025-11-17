import { Animation } from '@/libs';
import type { AnimationParams, EasingName, ZoomPanPinch } from '@/types';
import { inValidState, shouldComponentUpdate } from '../state';
import { handleCancelAnimationFrame } from './animation.utils';

export const handleCancelAnimation = (instance: ZoomPanPinch) => {
  if (!instance.mounted) return;

  handleCancelAnimationFrame(instance.animation);

  instance.animate = false;
  instance.animation = null;
  instance.velocity = null;
};

export function handleSetupAnimation(
  instance: ZoomPanPinch,
  easing: EasingName,
  duration: number,
  callback: (step: number) => void
) {
  if (!instance.mounted) return;
  const startTime = new Date().getTime();

  handleCancelAnimation(instance);

  instance.animation = () => {
    const frameTime = new Date().getTime() - startTime;

    if (frameTime >= duration) {
      instance.animation = null;

      callback(1);
    } else if (instance.animation) {
      const animationProgress = frameTime / duration;
      const animationType = Animation[easing];
      const step = animationType(animationProgress);
      callback(step);
      requestAnimationFrame(instance.animation);
    }
  };

  requestAnimationFrame(instance.animation);
}

export function animate(params: AnimationParams) {
  const { instance, to, duration = 0, easing = 'linear' } = params;
  if (inValidState(to)) return;

  const { setTransformState, transformState } = instance;

  if (!shouldComponentUpdate(transformState, to)) return;

  if (!duration) {
    setTransformState(to);
  } else {
    const { scale, positionX, positionY } = transformState;
    const scaleDiff = to.scale - scale;
    const positionXDiff = to.positionX - positionX;
    const positionYDiff = to.positionY - positionY;

    handleSetupAnimation(instance, easing, duration, (step) => {
      const newState = {
        scale: scale + scaleDiff * step,
        positionX: positionX + positionXDiff * step,
        positionY: positionY + positionYDiff * step,
      };
      setTransformState(newState);
    });
  }
}
