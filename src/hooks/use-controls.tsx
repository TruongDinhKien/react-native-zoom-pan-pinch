import React from 'react';

import { Context } from '@/components';
import type { ZoomPanPinchControls } from '@/types';
import { getControls } from '@/utils';

export const useControls = (): ZoomPanPinchControls => {
  const libraryContext = React.useContext(Context);

  if (!libraryContext) {
    throw new Error(
      'ZoomPanPinchView must be placed inside ZoomPanPinchContext'
    );
  }

  return getControls(libraryContext);
};
