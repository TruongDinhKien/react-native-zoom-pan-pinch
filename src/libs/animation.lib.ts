import type { EasingFunction } from '@/types';

export class Animation {
  public static linear: EasingFunction = (time) => {
    return time;
  };

  public static easeInCubic: EasingFunction = (time) => {
    return time * time * time;
  };

  public static easeInQuart: EasingFunction = (time) => {
    return time * time * time * time;
  };

  public static easeInQuad: EasingFunction = (time) => {
    return time * time;
  };

  public static easeInQuint: EasingFunction = (time) => {
    return time * time * time * time * time;
  };

  public static easeInOutCubic: EasingFunction = (time) => {
    return time < 0.5
      ? 4 * time * time * time
      : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1;
  };

  public static easeInOutQuart: EasingFunction = (time) => {
    const modifiedTime = time - 1;
    return time < 0.5
      ? 8 * time * time * time * time
      : 1 - 8 * modifiedTime * modifiedTime * modifiedTime * modifiedTime;
  };

  public static easeInOutQuad: EasingFunction = (time) => {
    return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time;
  };

  public static easeInOutQuint: EasingFunction = (time) => {
    const modifiedTime = time - 1;
    return time < 0.5
      ? 16 * time * time * time * time * time
      : 1 +
          16 *
            modifiedTime *
            modifiedTime *
            modifiedTime *
            modifiedTime *
            modifiedTime;
  };

  public static easeOut: EasingFunction = (time) => {
    return -Math.cos(time * Math.PI) / 2 + 0.5;
  };

  public static easeOutCubic: EasingFunction = (time) => {
    const modifiedTime = time - 1;
    return modifiedTime * modifiedTime * modifiedTime + 1;
  };

  public static easeOutQuart: EasingFunction = (time) => {
    const modifiedTime = time - 1;
    return 1 - modifiedTime * modifiedTime * modifiedTime * modifiedTime;
  };

  public static easeOutQuad: EasingFunction = (time) => {
    return time * (2 - time);
  };

  public static easeOutQuint: EasingFunction = (time) => {
    const modifiedTime = time - 1;
    return (
      1 +
      modifiedTime * modifiedTime * modifiedTime * modifiedTime * modifiedTime
    );
  };
}
