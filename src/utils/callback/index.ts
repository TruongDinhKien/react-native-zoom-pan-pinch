import type { ZoomPanPinch, ZoomPanPinchRef } from '@/types';
import { isFunction } from '../boolean';
import { getContext } from '../core';

export const handleCallback = <T>(
  instance: ZoomPanPinch,
  event: T,
  callback?: (context: ZoomPanPinchRef, event: T) => void
) => {
  if (isFunction(callback)) {
    const context = getContext(instance);
    callback(context, event);
  }
};
