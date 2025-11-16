import type { ZoomPanPinchSetup, ZoomPanPinchState } from '@/types';

export const initialState: ZoomPanPinchState = {
  previousScale: 1,
  scale: 1,
  positionX: 0,
  positionY: 0,
} as const;

const DEFAULT_EASING = 'easeOut';
export const initialSetup: ZoomPanPinchSetup = {
  disabled: false,
  minScale: 0.5,
  maxScale: 8,
  limitToBounds: true,
  centerZoomedOut: true,
  centerOnInit: false,
  disablePadding: false,
  smooth: true,
  panning: {
    disabled: false,
    velocityDisabled: false,
    lockAxisX: false,
    lockAxisY: false,
  },
  pinch: {
    step: 5,
    disabled: false,
  },
  zoomAnimation: {
    disabled: false,
    size: 0.4,
    duration: 200,
    easing: DEFAULT_EASING,
  },
  alignmentAnimation: {
    disabled: false,
    sizeX: 200,
    sizeY: 200,
    duration: 200,
    velocityAlignmentTime: 400,
    easing: DEFAULT_EASING,
  },
  velocityAnimation: {
    disabled: false,
    sensitivity: 1,
    duration: 400,
    easing: DEFAULT_EASING,
    equalToMove: true,
  },
} as const;
