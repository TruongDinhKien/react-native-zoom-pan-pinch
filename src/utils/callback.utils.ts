import type { RNZoomPanPinchRef } from '@/types';
import { isFunction } from '@/utils';

export const handleCallback = <T>(
  context: RNZoomPanPinchRef,
  event: T,
  callback?: (context: RNZoomPanPinchRef, event: T) => void
) => {
  if (isFunction(callback)) {
    callback(context, event);
  }
};
