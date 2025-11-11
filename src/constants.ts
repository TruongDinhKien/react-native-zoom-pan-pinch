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
    animationTime: 200,
    animationType: 'easeOut',
  },
  alignmentAnimation: {
    disabled: false,
    sizeX: 100,
    sizeY: 100,
    animationTime: 200,
    velocityAlignmentTime: 400,
    animationType: 'easeOut',
  },
  velocityAnimation: {
    disabled: false,
    sensitivity: 1,
    animationTime: 400,
    animationType: 'easeOut',
    equalToMove: true,
  },
} as const;
