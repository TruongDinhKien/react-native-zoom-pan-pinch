import type { RNZoomPanPinch } from '@/components/core';
import type { RNZoomPanPinchRef } from '@/types';
import { isFunction } from './boolean.utils';
import { getContext } from './context.utils';

export const handleCallback = <T>(
  instance: RNZoomPanPinch,
  event: T,
  callback?: (context: RNZoomPanPinchRef, event: T) => void
) => {
  const context = getContext(instance);
  if (isFunction(callback)) {
    callback(context, event);
  }
};
