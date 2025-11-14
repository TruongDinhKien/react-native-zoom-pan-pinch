import React from 'react';

import { Context } from '@/components';
import type { RNZoomPanPinchContentRef } from '@/types';
import { getControls } from '@/utils/context.utils';

export const useControls = (): RNZoomPanPinchContentRef => {
  const libraryContext = React.useContext(Context);

  if (!libraryContext) {
    throw new Error(
      'RNTransformer must be placed inside RNZoomPanPinchContext'
    );
  }

  return getControls(libraryContext);
};
