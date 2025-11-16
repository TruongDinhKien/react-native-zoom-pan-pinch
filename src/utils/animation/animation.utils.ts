import type { AnimationType } from '@/types';

export const handleCancelAnimationFrame = (animation: AnimationType | null) => {
  if (typeof animation === 'number') {
    cancelAnimationFrame(animation);
  }
};
