import { View } from 'react-native';
import { Animation } from '@/libs';

export type TStaticKeys<T> = Exclude<keyof T, 'prototype'>;
export type ViewType = typeof View;
export type ViewRef = React.ComponentRef<ViewType> | null;

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

export type AnimationOptions = {
  duration?: number;
  easing?: EasingName;
};

export type AnimationParams = AnimationOptions & {
  instance: ZoomPanPinch;
  to: StateType;
};

export interface SetTransformParams extends AnimationOptions, StateType {}

export interface IZoomOpts extends AnimationOptions {
  step?: number;
}

export interface ICenterViewOpts extends AnimationOptions {
  scale?: number;
}

export interface IZoomToElementOpts extends ICenterViewOpts {
  node: number | string;
}

export interface ZoomPanPinchState extends StateType {
  previousScale: number;
}

export type ZoomFunction = (
  step?: IZoomOpts['step'],
  duration?: IZoomOpts['duration'],
  easing?: IZoomOpts['easing']
) => void;

export interface ZoomPanPinchHandler {
  zoomIn: ZoomFunction;
  zoomOut: ZoomFunction;
  setTransform: (params: SetTransformParams) => void;
  reset: (duration?: number, easing?: EasingName) => void;
}
export type ZoomPanPinchContextState = {
  instance: ZoomPanPinchContext;
  state: ZoomPanPinchState;
};

export type StateType = {
  scale: number;
} & PositionType;

export type ZoomPanPinchControls = {
  instance: ZoomPanPinchContext;
} & ZoomPanPinchHandler;

export type ZoomPanPinchRef = ZoomPanPinchContextState & ZoomPanPinchHandler;

export type ZoomPanPinchRefProps = {
  setRef: (context: ZoomPanPinchRef) => void;
} & Omit<ZoomPanPinchProps, 'ref'>;

export type ZoomPanPinchProps = Partial<BoundsType> & {
  children?: React.ReactNode | ((ref: ZoomPanPinchControls) => React.ReactNode);
  ref?: React.Ref<ZoomPanPinchRef>;
  onLayout?: (event: LayoutChangeEvent) => void;

  initialScale?: number;
  initialPositionX?: number;
  initialPositionY?: number;
  disabled?: boolean;
  minScale?: number;
  maxScale?: number;
  limitToBounds?: boolean;
  centerZoomedOut?: boolean;
  centerOnInit?: boolean;
  disablePadding?: boolean;
  smooth?: boolean;

  onMoveStart?: (ref: ZoomPanPinchRef, event: GestureResponderEvent) => void;
  onMove?: (ref: ZoomPanPinchRef, event: GestureResponderEvent) => void;
  onMoveStop?: (ref: ZoomPanPinchRef, event: GestureResponderEvent) => void;
  onPinchingStart?: (
    ref: ZoomPanPinchRef,
    event: GestureResponderEvent
  ) => void;
  onPinching?: (ref: ZoomPanPinchRef, event: GestureResponderEvent) => void;
  onPinchingStop?: (ref: ZoomPanPinchRef, event: GestureResponderEvent) => void;
  onZoomStart?: (ref: ZoomPanPinchRef, event: GestureResponderEvent) => void;
  onZoom?: (ref: ZoomPanPinchRef, event: GestureResponderEvent) => void;
  onZoomStop?: (ref: ZoomPanPinchRef, event: GestureResponderEvent) => void;
  onTransformed?: (ref: ZoomPanPinchRef, state: StateType) => void;
  onInit?: (ref: ZoomPanPinchRef) => void;

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
  } & AnimationOptions;
  alignmentAnimation?: {
    disabled?: boolean;
    sizeX: number;
    sizeY: number;
    velocityAlignmentTime?: number;
  } & AnimationOptions;
  velocityAnimation?: {
    disabled?: boolean;
    sensitivity?: number;
    equalToMove?: boolean;
  } & AnimationOptions;
};

export type ZoomPanPinchComponentHelpers = {
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
  | 'onInit'
  | BoundaryProps;

type BoundaryProps =
  | 'minPositionX'
  | 'maxPositionX'
  | 'minPositionY'
  | 'maxPositionY';

type ZoomPanPinchSetup = Pick<ZoomPanPinchProps, BoundaryProps> &
  DeepNonNullable<Omit<ZoomPanPinchProps, ExcludedProps>>;

export type BoundsType = Record<BoundaryProps, number>;

export type PositionType = {
  positionX: number;
  positionY: number;
};

export type VelocityType = {
  velocityX: number;
  velocityY: number;
  total: number;
};

export type EasingName = TStaticKeys<typeof Animation>;

export type AnimationType = () => void | number;

export interface EasingFunction {
  (time: number): number;
}

export interface ZoomPanPinch {
  // --- Thuộc tính Trạng thái & Cấu hình ---
  props: ZoomPanPinchProps;
  transformState: ZoomPanPinchState;
  setup: ZoomPanPinchSetup;

  // --- Trạng thái Component ---
  mounted: boolean;
  isInitialized: boolean;
  isLayoutReady: boolean;
  bounds: BoundsType | null;

  // --- Kích thước và Vị trí (Wrapper/Content) ---
  wrapperComponent: ViewRef;
  contentComponent: ViewRef;
  wrapperHeight: number;
  wrapperWidth: number;
  wrapperX: number; // Đã thêm
  wrapperY: number; // Đã thêm
  contentHeight: number;
  contentWidth: number;

  // --- Helpers Panning ---
  isPanning: boolean;
  startCoords: StartCoordsType;
  clientCoords: ClientCoordsType;
  lastTouch: number | null;
  lastTouchPosition: PositionType | null;

  // --- Helpers Pinching ---
  pinchLastCenterX: number | null;
  pinchLastCenterY: number | null;
  distance: null | number;
  lastDistance: null | number;
  pinchStartDistance: null | number;
  pinchStartScale: null | number;
  pinchMidpoint: null | PositionType;

  // --- Helpers Velocity ---
  velocity: VelocityType | null;
  velocityTime: number | null;

  // --- Helpers Animations ---
  animate: boolean;
  animation: AnimationType | null;

  // --- Callbacks (Để các hàm logic có thể gọi setTransformState) ---
  onChangeCallbacks: Set<(ctx: ZoomPanPinchRef) => void>; // Đã thêm
  onInitCallbacks: Set<(ctx: ZoomPanPinchRef) => void>; // Đã thêm

  // --- Phương thức Cần thiết cho Logic/Utils ---
  setTransformState: (newState: StateType) => void;
  applyTransformation: () => void;
}
