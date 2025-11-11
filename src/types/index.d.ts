import type { RNZoomPanPinch } from '@/core';
import { InstanceHandlers } from '@/utils';
import { Animation } from '@/libs';
// --------------------------------------------------
export type TStaticKeys<T> = Exclude<keyof T, 'prototype'>;

export type DeepNonNullable<T> = T extends (...args: any[]) => any
  ? T
  : T extends any[]
    ? DeepNonNullableArray<T[number]>
    : T extends object
      ? DeepNonNullableObject<T>
      : T;

export type DeepNonNullableArray<T> = Array<DeepNonNullable<NonNullable<T>>>;

export type DeepNonNullableObject<T> = {
  [P in keyof T]-?: DeepNonNullable<NonNullable<T[P]>>;
};

// --------------------------------------------------
export type TStaticValues<T> = T[TStaticKeys<T>];

export type RNZoomPanPinchContext = typeof RNZoomPanPinch.prototype;

export type AnimationOptions = {
  animationTime?: number;
  animationType?: AnimationType;
};

export interface IZoomOpts extends AnimationOptions {
  step?: number;
}

export interface SetTransformOpts extends AnimationOptions {
  newPositionX: number;
  newPositionY: number;
  newScale: number;
}

export interface ICenterViewOpts extends AnimationOptions {
  scale?: number;
}

export interface IZoomToElementOpts extends AnimationOptions {
  node: number | string;
  scale?: number;
}

export type RNZoomPanPinchState = {
  previousScale: number;
  scale: number;
  positionX: number;
  positionY: number;
};

export type RNZoomPanPinchHandlers = {
  zoomIn: ReturnType<typeof InstanceHandlers.zoomIn>;
  zoomOut: ReturnType<typeof InstanceHandlers.zoomOut>;
  setTransform: ReturnType<typeof InstanceHandlers.setTransform>;
};
export type RNZoomPanPinchContextState = {
  instance: RNZoomPanPinchContext;
  state: RNZoomPanPinchState;
};

export type StateType = {
  scale: number;
  positionX: number;
  positionY: number;
};

export type RNZoomPanPinchContextRef = {
  instance: RNZoomPanPinchContext;
} & RNZoomPanPinchHandlers;

export type RNZoomPanPinchRef = RNZoomPanPinchContextState &
  RNZoomPanPinchHandlers;

export type RNZoomPanPinchRefProps = {
  setRef: (context: RNZoomPanPinchRef) => void;
} & Omit<RNZoomPanPinchProps, 'ref'>;

export type RNZoomPanPinchProps = {
  children?:
    | React.ReactNode
    | ((ref: RNZoomPanPinchContextRef) => React.ReactNode);
  ref?: React.Ref<RNZoomPanPinchRef>;
  onLayout?: (event: LayoutChangeEvent) => void;

  initialScale?: number;
  initialPositionX?: number;
  initialPositionY?: number;
  disabled?: boolean;
  minPositionX?: null | number;
  maxPositionX?: null | number;
  minPositionY?: null | number;
  maxPositionY?: null | number;
  minScale?: number;
  maxScale?: number;
  limitToBounds?: boolean;
  centerZoomedOut?: boolean;
  centerOnInit?: boolean;
  disablePadding?: boolean;
  smooth?: boolean;

  onMoveStart?: (ref: RNZoomPanPinchRef, event: GestureResponderEvent) => void;
  onMove?: (ref: RNZoomPanPinchRef, event: GestureResponderEvent) => void;
  onMoveStop?: (ref: RNZoomPanPinchRef, event: GestureResponderEvent) => void;
  onPinchingStart?: (
    ref: RNZoomPanPinchRef,
    event: GestureResponderEvent
  ) => void;
  onPinching?: (ref: RNZoomPanPinchRef, event: GestureResponderEvent) => void;
  onPinchingStop?: (
    ref: RNZoomPanPinchRef,
    event: GestureResponderEvent
  ) => void;
  onZoomStart?: (ref: RNZoomPanPinchRef, event: GestureResponderEvent) => void;
  onZoom?: (ref: RNZoomPanPinchRef, event: GestureResponderEvent) => void;
  onZoomStop?: (ref: RNZoomPanPinchRef, event: GestureResponderEvent) => void;
  onTransformed?: (
    ref: RNZoomPanPinchRef,
    state: { scale: number; positionX: number; positionY: number }
  ) => void;
  onInit?: (ref: RNZoomPanPinchRef) => void;

  panning?: {
    disabled?: boolean;
    velocityDisabled?: boolean;
    lockAxisX?: boolean;
    lockAxisY?: boolean;
  };
  pinch?: {
    step?: number;
    disabled?: boolean;
  };
  zoomAnimation?: {
    disabled?: boolean;
    size?: number;
    animationTime?: number;
    animationType?: EasingName;
  };
  alignmentAnimation?: {
    disabled?: boolean;
    sizeX: number;
    sizeY: number;
    animationTime?: number;
    velocityAlignmentTime?: number;
    animationType?: EasingName;
  };
  velocityAnimation?: {
    disabled?: boolean;
    sensitivity?: number;
    animationTime?: number;
    animationType?: EasingName;
    equalToMove?: boolean;
  };
};

export type RNZoomPanPinchComponentHelpers = {
  setComponents: (
    wrapper: React.RefObject<View>,
    content: React.RefObject<View>
  ) => void;
};

type ExcludedProps =
  | 'ref'
  | 'children'
  | 'onLayout'
  | 'initialScale'
  | 'initialPositionX'
  | 'initialPositionY'
  | 'minPositionX'
  | 'maxPositionX'
  | 'minPositionY'
  | 'maxPositionY'
  | 'onMoveStart'
  | 'onMove'
  | 'onMoveStop'
  | 'onPinchingStart'
  | 'onPinching'
  | 'onPinchingStop'
  | 'onZoomStart'
  | 'onZoom'
  | 'onZoomStop'
  | 'onTransformed'
  | 'onInit';

type BoundaryProps =
  | 'minPositionX'
  | 'maxPositionX'
  | 'minPositionY'
  | 'maxPositionY';

type LibrarySetup = Pick<RNZoomPanPinchProps, BoundaryProps & 'wrapperWidth'> & // The optional boundary props
  DeepNonNullable<
    Omit<
      RNZoomPanPinchProps,
      ExcludedProps // The rest, made mandatory
    >
  >;

export interface AnimateOptions {
  instance: RNZoomPanPinch;
  to: StateType;
  duration: number;
  easing: EasingName;
}

export type BoundsType = {
  minPositionX: number;
  maxPositionX: number;
  minPositionY: number;
  maxPositionY: number;
};

export type PositionType = {
  x: number;
  y: number;
};

export type VelocityType = {
  velocityX: number;
  velocityY: number;
  total: number;
};

export type EasingName = TStaticKeys<typeof Animation>;

export type AnimationType = null | (() => void | number);

export interface EasingFunction {
  (time: number): number;
}
