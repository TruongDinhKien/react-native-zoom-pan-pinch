import { Button, StyleSheet, View } from 'react-native';

import { TEST_ID } from '../constants';
import type { ZoomPanPinchControls } from '@/types';

export const Controls: React.FC<ZoomPanPinchControls> = (props) => {
  const { zoomIn, zoomOut, reset } = props;

  return (
    <View style={styles.controlGroup}>
      <Button
        title="Zoom In"
        onPress={() => zoomIn()}
        testID={TEST_ID.BTN_ZOOM_IN}
      />
      <Button
        title="Zoom Out"
        onPress={() => zoomOut()}
        testID={TEST_ID.BTN_ZOOM_OUT}
      />
      <Button
        title="Zoom Reset"
        onPress={() => reset()}
        testID={TEST_ID.BTN_RESET}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  controlGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
