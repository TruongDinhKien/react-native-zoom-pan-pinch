import type { LibrarySetup, RNZoomPanPinchState } from '@/types';

export const initialState: RNZoomPanPinchState = {
  previousScale: 1,
  scale: 1,
  positionX: 0,
  positionY: 0,
} as const;

export const initialSetup: LibrarySetup = {
  disabled: false,
  minScale: 1,
  maxScale: 8,
  limitToBounds: true,
  centerZoomedOut: false,
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
    easing: 'easeOut',
  },
  alignmentAnimation: {
    disabled: false,
    sizeX: 100,
    sizeY: 100,
    duration: 200,
    velocityAlignmentTime: 400,
    easing: 'easeOut',
  },
  velocityAnimation: {
    disabled: false,
    sensitivity: 1,
    duration: 400,
    easing: 'easeOut',
    equalToMove: true,
  },
} as const;
