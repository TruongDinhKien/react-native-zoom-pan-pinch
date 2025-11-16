import { initialSetup, initialState } from '@/default.config';
import type {
  StateType,
  ZoomPanPinchControls,
  ZoomPanPinchProps,
  ZoomPanPinchSetup,
  ZoomPanPinchState,
} from '@/types';

export const renderChildren = (
  children: ZoomPanPinchProps['children'],
  ctx: ZoomPanPinchControls
) => {
  if (typeof children === 'function') {
    return children(ctx);
  }
  return children;
};

export const createSetup = (props: ZoomPanPinchProps): ZoomPanPinchSetup => {
  const newSetup: ZoomPanPinchSetup = { ...initialSetup };

  (Object.keys(props) as Array<keyof ZoomPanPinchProps>).forEach((key) => {
    if (!(key in initialSetup)) return;

    const setupKey = key as keyof ZoomPanPinchSetup;

    const propValue = props[key];
    const initialValue = initialSetup[setupKey]!;

    if (typeof propValue !== 'undefined') {
      const dataType = Object.prototype.toString.call(initialValue);
      const isObject = dataType === '[object Object]';
      const isArray = dataType === '[object Array]';

      if (isObject && !isArray) {
        (newSetup[setupKey] as object) = {
          ...(initialValue as object),
          ...(propValue as object),
        };
      } else if (isArray) {
        (newSetup[setupKey] as any) = [
          ...(initialValue as any),
          ...(propValue as any),
        ];
      } else {
        (newSetup[setupKey] as any) = propValue;
      }
    }
  });

  return newSetup;
};

export const createState = (props: ZoomPanPinchProps): ZoomPanPinchState => {
  return {
    previousScale: props.initialScale ?? initialState.scale,
    scale: props.initialScale ?? initialState.scale,
    positionX: props.initialPositionX ?? initialState.positionX,
    positionY: props.initialPositionY ?? initialState.positionY,
  };
};

export const inValidState = (state: StateType): boolean => {
  return (
    Number.isNaN(state.scale) ||
    Number.isNaN(state.positionX) ||
    Number.isNaN(state.positionY)
  );
};

export const shouldComponentUpdate = (
  prev: Omit<ZoomPanPinchState, 'previousScale'>,
  next: Omit<ZoomPanPinchState, 'previousScale'>
): boolean => {
  return (
    prev.positionX !== next.positionX ||
    prev.positionY !== next.positionY ||
    prev.scale !== next.scale
  );
};
